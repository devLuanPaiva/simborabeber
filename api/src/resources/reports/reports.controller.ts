import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CategoryComparisonItem } from './utils/reports.utils';
import { SalesIndicatorsDto } from './dto/sales-indicators.dto';
import { WeeklySalesComparisonDto, MonthlyWeeklyComparisonDto, LastMonthsComparisonDto } from './dto/weekly-sales-comparison.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('reports')
@ApiTags('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

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

  @Get('weekly-sales-comparison')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Obter comparativo de vendas por dia da semana do bar" })
  @ApiResponse({ status: 200, description: "Comparativo retornado com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Bar não encontrado" })
  async getWeeklySalesComparison(@Req() req): Promise<WeeklySalesComparisonDto> {
    const slug: string = req.user?.slug;
    return this.reportsService.calculateWeeklySalesComparison(slug);
  }

  @Get('monthly-weekly-comparison')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Obter comparativo de vendas entre semanas do mês do bar" })
  @ApiResponse({ status: 200, description: "Comparativo retornado com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Bar não encontrado" })
  async getMonthlyWeeklyComparison(@Req() req): Promise<MonthlyWeeklyComparisonDto> {
    const slug: string = req.user?.slug;
    return this.reportsService.calculateMonthlyWeeklyComparison(slug);
  }

  @Get('last-months-comparison')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Obter comparativo de vendas entre os últimos 6 meses do bar" })
  @ApiResponse({ status: 200, description: "Comparativo retornado com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Bar não encontrado" })
  async getLastSixMonthsComparison(@Req() req): Promise<LastMonthsComparisonDto> {
    const slug: string = req.user?.slug;
    return this.reportsService.calculateLastSixMonthsComparison(slug);
  }

  @Get('categories-comparison')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Obter comparação por categorias do bar" })
  @ApiResponse({ status: 200, description: "Comparativo retornado com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Bar não encontrado" })
  async getCategoriesComparison(@Req() req): Promise<{ categories: CategoryComparisonItem[] }> {
    const slug: string = req.user?.slug;
    return this.reportsService.calculateCategoriesComparison(slug);
  }


}
