import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  private async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, password: true, isActive: true },
    })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException({ error: "Usuário ou senha inválidos", message: "Credenciais inválidas", code: "INVALID_CREDENTIALS" });
    }
    return user
  }

  async signIn({ email, password }: AuthDto): Promise<{ access_token: string, refresh_token: string }> {
    const user = await this.validateUser(email, password)
    if (!user.isActive) throw new UnauthorizedException({ error: "Conta inativa", message: "Conta inativa", code: "ACCOUNT_INACTIVE" })

    const payload = { id: user.id, email: user.email, role: user.role, name: user.name, isActive: user.isActive, }

    const access_token = await this.jwtService.signAsync({ ...payload, type: 'access' })
    const refresh_token = await this.jwtService.signAsync({ ...payload, type: 'refresh' }, { expiresIn: '2h' })

    return { access_token, refresh_token }
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string, refresh_token: string }> {
    try {
      const decoded = this.jwtService.verify(refreshToken)
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException({ error: "Token inválido", message: "Token inválido", code: "INVALID_TOKEN" })
      }

      const user = await this.prismaService.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true, isActive: true },
      })
      if (!user) {
        throw new UnauthorizedException({ error: "Token inválido", message: "Token inválido", code: "INVALID_TOKEN" })
      }

      const { id, email, role, name, isActive } = user
      const payload = { id, email, role, name, isActive }

      const access_token = await this.jwtService.signAsync(payload)
      const new_refresh_token = await this.jwtService.signAsync({ ...payload, type: 'refresh' }, { expiresIn: '2h' })

      return { access_token, refresh_token: new_refresh_token }
    } catch (error) {
      throw new UnauthorizedException(
        {
          error: "Token inválido",
          message: error,
          code: "INVALID_TOKEN"
        }
      )
    }
  }
}
