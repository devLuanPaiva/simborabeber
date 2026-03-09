
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ROLES_KEY } from "../decorators/roles.decorator"
import { UserRole } from "../resources/user/entities/user.entity"

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (!requiredRoles) return true

        const { user } = context.switchToHttp().getRequest()
        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException("Você não tem permissão para acessar esta rota.")
        }

        return true
    }
}