import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post("login")
  @ApiOperation({ summary: "Login do usuário" })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 200, description: "Login realizado com sucesso" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  async loginOrganizer(@Body() { email, password }: AuthDto) {
    return this.authService.signIn({ email, password })
  }
}
