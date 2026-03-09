import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { AuthRepository } from './repository/auth.repository';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
    sub: string;
    email: string;
    name: string;
    role: string;
    type: 'access' | 'refresh';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}


@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const user = await this.authRepository.findByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException({ message: 'Credenciais inválidas', detail: 'Credenciais inválidas' });
        }

        const isPasswordValid = compareSync(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException({ message: 'Credenciais inválidas', detail: 'Credenciais inválidas' });
        }

        await this.authRepository.updateLastLogin(user.id);

        const tokens = await this.generateTokens(user.id, user.email, user.name, user.role);

        return {
            ...tokens,
        }


    }

    async refresh(refreshToken: string): Promise<AuthResponse> {
        try {

            const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
                secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            });

            if (payload.type !== 'refresh') {
                throw new UnauthorizedException({ message: 'Refresh token inválido', detail: 'Refresh token inválido' });
            }
            const user = await this.authRepository.findById(payload.sub);

            if (!user) {
                throw new UnauthorizedException({ message: 'Usuário não encontrado', detail: 'Usuário não encontrado' });
            }

            await this.authRepository.updateLastLogin(user.id);

            const tokens = await this.generateTokens(user.id, user.email, user.name, user.role);

            return {
                ...tokens,
            };
        } catch {
            throw new UnauthorizedException({ message: 'Refresh token inválido ou expirado', detail: 'Refresh token inválido ou expirado' });
        }
    }

    private async generateTokens(
        userId: string,
        email: string,
        name: string,
        role: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const payload: Partial<JwtPayload> = {
            sub: userId,
            email,
            name,
            role,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ type: 'access', ...payload }, {
                secret: this.configService.getOrThrow<string>('JWT_SECRET'),
                expiresIn: '1h',
            }),
            this.jwtService.signAsync({ type: 'refresh', ...payload }, {
                secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
                expiresIn: '2h',
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}

