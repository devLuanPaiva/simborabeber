import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const secret = this.configService.get<string>("JWT_SECRET")
        const token = this.extractTokenFromHeader(request)
        if (!token) {
            throw new UnauthorizedException({ message: 'Acesso não autorizado', field: 'token', detail: 'Nenhum token fornecido.' })
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret })
            if (!payload) throw new UnauthorizedException({ message: 'Token inválido', field: 'token', detail: 'O token fornecido é inválido ou expirou.' })
            request.user = payload
        } catch {
            throw new UnauthorizedException({ message: 'Acesso não autorizado', field: 'token', detail: 'O token fornecido é inválido ou expirou.' })
        }
        return true
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? []
        return type === "Bearer" ? token : undefined
    }
}