export class SalesIndicatorsDto {
    /**
     * Total de vendas geral em reais
     */
    totalRevenue: number;

    /**
     * Total de vendas do dia atual em reais
     */
    todayRevenue: number;

    /**
     * Valor médio por comanda em reais
     */
    averageTicketValue: number;

    /**
     * Total de comandas fechadas
     */
    closedTabsCount: number;

    openedTabsCount?: number;
}
