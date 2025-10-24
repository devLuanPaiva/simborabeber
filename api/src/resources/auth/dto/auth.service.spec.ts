import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let prismaMock: any;
    let jwtMock: any;

    beforeEach(() => {
        prismaMock = {
            user: {
                findUnique: jest.fn(),
            },
        };

        jwtMock = {
            signAsync: jest.fn(),
            verify: jest.fn(),
        };

        jest.spyOn(bcrypt, 'compare').mockReset();

        service = new AuthService(prismaMock as any, jwtMock as any);
    });

    it('Should successfully sign in with valid credentials (returns access and refresh tokens)', async () => {
        const dto = { email: 'a@a.com', password: 'plain' };
        const user = {
            id: '1',
            email: dto.email,
            name: 'User',
            role: 'ADMIN',
            password: 'hashed_pw',
            isActive: true,
        };
        prismaMock.user.findUnique.mockResolvedValue(user);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        jwtMock.signAsync.mockResolvedValueOnce('access_token').mockResolvedValueOnce('refresh_token');

        const tokens = await service.signIn(dto as any);

        expect(prismaMock.user.findUnique).toBeCalledWith({
            where: { email: dto.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                password: true,
                isActive: true,
            },
        });
        expect(bcrypt.compare).toBeCalledWith(dto.password, user.password);
        expect(jwtMock.signAsync).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: 'access' }));
        expect(jwtMock.signAsync).toHaveBeenNthCalledWith(2, expect.objectContaining({ type: 'refresh' }), { expiresIn: '2h' });
        expect(tokens).toEqual({ access_token: 'access_token', refresh_token: 'refresh_token' });
    });

    it('Should throw UnauthorizedException when email does not exist', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        await expect(service.signIn({ email: 'no@no', password: 'x' } as any)).rejects.toThrow(UnauthorizedException);
        expect(bcrypt.compare).not.toBeCalled();
        expect(jwtMock.signAsync).not.toBeCalled();
    });


});