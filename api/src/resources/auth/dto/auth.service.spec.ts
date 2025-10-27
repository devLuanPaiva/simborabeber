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
    expect(jwtMock.signAsync).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: 'access' }),
    );
    expect(jwtMock.signAsync).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: 'refresh' }),
      { expiresIn: '2h' },
    );
    expect(tokens).toEqual({ access_token: 'access_token', refresh_token: 'refresh_token' });
  });

  it('Should throw UnauthorizedException when email does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(service.signIn({ email: 'no@no', password: 'x' } as any)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(bcrypt.compare).not.toBeCalled();
    expect(jwtMock.signAsync).not.toBeCalled();
  });

  it('Should throw UnauthorizedException when password is incorrect', async () => {
    const user = {
      id: '1',
      email: 'e',
      name: 'n',
      role: 'USER',
      password: 'hashed',
      isActive: true,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.signIn({ email: 'e', password: 'wrong' } as any)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(bcrypt.compare).toBeCalledWith('wrong', 'hashed');
    expect(jwtMock.signAsync).not.toBeCalled();
  });

  it('Should throw UnauthorizedException when the user account is inactive', async () => {
    const user = {
      id: '1',
      email: 'e',
      name: 'n',
      role: 'USER',
      password: 'hashed',
      isActive: false,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(service.signIn({ email: 'e', password: 'ok' } as any)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(bcrypt.compare).toBeCalledWith('ok', 'hashed');
  });

  it('Should generate both access and refresh tokens using JwtService.signAsync()', async () => {
    const dto = { email: 'a@a', password: 'p' };
    const user = { id: '1', email: dto.email, name: 'N', role: 'R', password: 'h', isActive: true };
    prismaMock.user.findUnique.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtMock.signAsync.mockResolvedValueOnce('A').mockResolvedValueOnce('R');

    await service.signIn(dto as any);

    expect(jwtMock.signAsync).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        isActive: user.isActive,
        type: 'access',
      }),
    );
    expect(jwtMock.signAsync).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        isActive: user.isActive,
        type: 'refresh',
      }),
      { expiresIn: '2h' },
    );
  });

  it('Should verify that refreshToken() returns new tokens when given a valid refresh token', async () => {
    const refreshToken = 'rt';
    const decoded = { id: 'u1', type: 'refresh' };
    jwtMock.verify.mockReturnValue(decoded);
    const user = { id: 'u1', email: 'e', name: 'n', role: 'r', isActive: true };
    prismaMock.user.findUnique.mockResolvedValue(user);
    jwtMock.signAsync.mockResolvedValueOnce('newA').mockResolvedValueOnce('newR');

    const tokens = await service.refreshToken(refreshToken);

    expect(jwtMock.verify).toBeCalledWith(refreshToken);
    expect(prismaMock.user.findUnique).toBeCalledWith({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
    expect(jwtMock.signAsync).toHaveBeenCalledTimes(2);
    expect(tokens).toEqual({ access_token: 'newA', refresh_token: 'newR' });
  });

  it('Should throw UnauthorizedException when the refresh token has an invalid type (not "refresh")', async () => {
    jwtMock.verify.mockReturnValue({ id: 'u1', type: 'access' });

    await expect(service.refreshToken('bad')).rejects.toThrow(UnauthorizedException);
    expect(prismaMock.user.findUnique).not.toBeCalled();
    expect(jwtMock.signAsync).not.toBeCalled();
  });

  it('Should throw UnauthorizedException when the refresh token belongs to a non-existing user', async () => {
    jwtMock.verify.mockReturnValue({ id: 'missing', type: 'refresh' });
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(service.refreshToken('rt')).rejects.toThrow(UnauthorizedException);
    expect(prismaMock.user.findUnique).toBeCalledWith({
      where: { id: 'missing' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  });

  it('Should throw UnauthorizedException when the refresh token verification fails (jwtService.verify throws)', async () => {
    jwtMock.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    await expect(service.refreshToken('rt')).rejects.toThrow(UnauthorizedException);
    expect(prismaMock.user.findUnique).not.toBeCalled();
  });

  it('Should call bcrypt.compare() correctly during validateUser()', async () => {
    const dto = { email: 'x@y', password: 'pw' };
    const user = {
      id: '1',
      email: dto.email,
      name: 'N',
      role: 'R',
      password: 'hashed_pw',
      isActive: true,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtMock.signAsync.mockResolvedValueOnce('a').mockResolvedValueOnce('r');

    await service.signIn(dto as any);

    expect(bcrypt.compare).toBeCalledWith(dto.password, user.password);
  });
});
