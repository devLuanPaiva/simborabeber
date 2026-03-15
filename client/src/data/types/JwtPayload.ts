export interface IJwtPayload {
    sub: string;
    email: string;
    name: string;
    role: string;
    slug?: string;
    type: 'access' | 'refresh';
    iat: number;
    exp: number;
}
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}