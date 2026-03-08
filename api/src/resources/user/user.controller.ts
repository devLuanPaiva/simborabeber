import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"


@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: "Criar um novo usuário" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: "Usuário criado com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os usuários" })
  @ApiResponse({ status: 200, description: "Usuários listados com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Obter um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário encontrado com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Atualizar um usuário pelo ID" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: "Usuário atualizado com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Remover um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário removido com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
