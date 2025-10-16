import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
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

  async signIn({ email, password }: AuthDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(email, password)
    if (!user.isActive) throw new UnauthorizedException({ error: "Conta inativa", message: "Conta inativa", code: "ACCOUNT_INACTIVE" })

    const payload = { id: user.id, email: user.email, role: user.role, name: user.name, isActive: user.isActive }
    const access_token = await this.jwtService.signAsync(payload)
    return { access_token }
  }
}
