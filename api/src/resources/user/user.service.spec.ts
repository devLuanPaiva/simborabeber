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

  it('Should throw UnauthorizedException if email already exists', async () => {
    const dto = { name: 'Dup', email: 'dup@example.com', password: 'x' };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });

    await expect(service.createUser(dto as any)).rejects.toThrow(UnauthorizedException);
    expect(prismaMock.user.create).not.toBeCalled();
  });

  it(' Should list all users (without returning the password field)', async () => {
    const users = [
      { id: '1', name: 'A', email: 'a@a', role: Role.WAITER, isActive: true, createdAt: new Date() },
    ];
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue(users);

    const result = await service.getAllUsers();

    expect(prismaMock.user.findMany).toBeCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    expect(result).toEqual(users);
  });

  it('Should return a user by ID when found', async () => {
    const user = { id: '1', name: 'A', email: 'a@a', role: Role.WAITER, isActive: true, createdAt: new Date() };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(user);

    const result = await service.getUserById('1');

    expect(prismaMock.user.findUnique).toBeCalledWith({
      where: { id: '1' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    expect(result).toEqual(user);
  });

  it('Should throw NotFoundException if user is not found by ID', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.getUserById('missing')).rejects.toThrow(NotFoundException);
  });

  it('Should update user name and isActive successfully', async () => {
    const dto = { name: 'Updated', isActive: false };
    const updated = { id: 'u1', name: dto.name, email: 'e', role: Role.WAITER, isActive: dto.isActive, createdAt: new Date() };
    (prismaMock.user.update as jest.Mock).mockResolvedValue(updated);

    const result = await service.updateUser('u1', dto as any);

    expect(prismaMock.user.update).toBeCalledWith({
      where: { id: 'u1' },
      data: {
        name: dto.name,
        isActive: dto.isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    expect(result).toEqual(updated);
  });

  it('Should handle exception when trying to update a non-existing user', async () => {
    (prismaMock.user.update as jest.Mock).mockRejectedValue(new Error('Record not found'));

    await expect(service.updateUser('nope', { name: 'X', isActive: true } as any)).rejects.toThrow('Record not found');
    expect(handleException).toBeCalled();
  });

  it('Should delete a user successfully and return deleted data', async () => {
    const deleted = { id: 'd1', name: 'Del', email: 'd@d', role: Role.WAITER, isActive: true, createdAt: new Date() };
    (prismaMock.user.delete as jest.Mock).mockResolvedValue(deleted);

    const result = await service.deleteUser('d1');

    expect(prismaMock.user.delete).toBeCalledWith({
      where: { id: 'd1' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    expect(result).toEqual(deleted);
  });

  it('Should handle exception when trying to delete a non-existing user', async () => {
    (prismaMock.user.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

    await expect(service.deleteUser('nope')).rejects.toThrow('Delete failed');
    expect(handleException).toBeCalled();
  });
});
