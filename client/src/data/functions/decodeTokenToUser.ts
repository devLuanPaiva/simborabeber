import { ITokenPayload,} from "../models";
import { jwtDecode } from "jwt-decode"
export function decodeTokenToUser(token?: string): ITokenPayload| null {
    if (!token || typeof token !== "string" || token.split(".").length !== 3) {
        return null;
    }

    try {
        const decoded = jwtDecode<ITokenPayload>(token);
        return {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
            isActive: decoded.isActive || true,
            establishmentId: decoded.establishmentId || undefined,
            exp: decoded.exp,
            iat: decoded.iat,
            type: decoded.type,

        };
    } catch (err) {
        console.error("Erro ao decodificar JWT:", err);
        return null;
    }
}