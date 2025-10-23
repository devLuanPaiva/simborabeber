import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { handleException } from '../../functions/handleException';

jest.mock('../../functions/handleException', () => ({
  handleException: jest.fn((err: unknown) => {
    throw err;
  }),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));
describe('UserService', () => {
  let service: UserService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    (handleException as unknown as jest.Mock).mockClear();
    (bcrypt.hash as jest.Mock).mockClear();

    service = new UserService(prismaMock);
  });

  it('Should create a new user successfully (hashes password and returns user data)', async () => {
    const dto = { name: 'John', email: 'john@example.com', password: 'plain', role: Role.ADMIN };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pw');
    const created = { id: '1', name: dto.name, email: dto.email, role: dto.role, password: 'hashed_pw' };
    (prismaMock.user.create as jest.Mock).mockResolvedValue(created);

    const result = await service.createUser(dto as any);

    expect(bcrypt.hash).toBeCalledWith('plain', 10);
    expect(prismaMock.user.create).toBeCalledWith({
      data: {
        name: dto.name,
        email: dto.email,
        password: 'hashed_pw',
        role: dto.role,
      },
    });
    expect(result).toEqual(created);
  });

  it('Should set default role as WAITER when no role is provided', async () => {
    const dto = { name: 'Jane', email: 'jane@example.com', password: 'pwd' };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pwd');
    const created = { id: '2', name: dto.name, email: dto.email, role: Role.WAITER, password: 'hashed_pwd' };
    (prismaMock.user.create as jest.Mock).mockResolvedValue(created);

    await service.createUser(dto as any);

    expect(prismaMock.user.create).toBeCalledWith({
      data: {
        name: dto.name,
        email: dto.email,
        password: 'hashed_pwd',
        role: Role.WAITER,
      },
    });
  });


});
