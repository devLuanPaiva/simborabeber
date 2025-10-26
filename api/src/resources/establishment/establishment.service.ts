import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { PrismaService } from '../../database/prisma.service';
import { UserDto } from '../user/dto/create-user.dto';
import { handleException } from '../../functions/handleException';

@Injectable()
export class EstablishmentService {
  constructor(private readonly prismaService: PrismaService) {}

  private ensureIsMechanic(user: UserDto) {
    if (user.role !== 'MANAGER') {
      throw new ForbiddenException({
        error: 'Apenas gerentes podem realizar esta ação',
        code: 'FORBIDDEN_ACTION',
      });
    }
  }

  async createEstablishmentDto(data: CreateEstablishmentDto, user: UserDto) {
    this.ensureIsMechanic(user);

    try {
      return await this.prismaService.establishment.create({
        data: {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          type: data.type,
          slug: data.slug,
          users: {
            connect: { id: user.id },
          },
        },
      });
    } catch (error) {
      handleException(error, 'Erro ao criar estabelecimento');
    }
  }

  async getEstablishmentByUser(user: UserDto) {
    try {
      const establishments = await this.prismaService.establishment.findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      });
      return establishments;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        message: 'Erro ao buscar estabelecimentos do usuário',
        error: error?.meta?.cause || error.message,
        code: error?.code || 'ESTABLISHMENT_FETCH_ERROR',
      });
    }
  }

  async updateEstablishment(id: string, data: UpdateEstablishmentDto, user: UserDto) {
    this.ensureIsMechanic(user);
    try {
      return await this.prismaService.establishment.update({
        where: { id },
        data: {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          type: data.type,
          slug: data.slug,
        },
      });
    } catch (error) {
      handleException(error, 'Erro ao atualizar estabelecimento');
    }
  }

  async deleteEstablishment(id: string, user: UserDto) {
    this.ensureIsMechanic(user);
    try {
      await this.prismaService.establishment.delete({
        where: { id },
      });
    } catch (error) {
      handleException(error, 'Erro ao deletar estabelecimento');
    }
  }
}
