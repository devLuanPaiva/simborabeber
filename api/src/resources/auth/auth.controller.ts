import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthResponse, AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: "Autenticar um usuário" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "Usuário autenticado com sucesso" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: "Atualizar tokens de autenticação" })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: "Tokens atualizados com sucesso" })
  @ApiResponse({ status: 401, description: "Refresh token inválido ou expirado" })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }
}

