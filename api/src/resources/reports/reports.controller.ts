import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { SalesIndicatorsDto } from './dto/sales-indicators.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('reports')
@ApiTags('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales-indicators')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Obter indicadores de vendas do bar do usuário logado" })
  @ApiResponse({ status: 200, description: "Indicadores retornados com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Bar não encontrado" })
  async getSalesIndicators(@Req() req): Promise<SalesIndicatorsDto> {
    const slug: string = req.user?.slug;
    return this.reportsService.calculateSalesIndicators(slug);
  }
}
