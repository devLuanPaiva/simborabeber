import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { TabItemService } from "./tab-item.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyTabItemsDto, CreateTabItemDto } from './dto/create-tab-item.dto';
import { UpdateTabItemDto } from './dto/update-tab-item.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';



@Controller('tab-item')
@ApiTags('tab-items')
export class TabItemController {
    constructor(private readonly tabItemService: TabItemService) { }

    @Post('by-tab/:tabId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MANAGER, UserRole.WAITER)
    @ApiOperation({ summary: "Adicionar um item a uma comanda pelo ID da comanda" })
    @ApiBody({ type: CreateTabItemDto })
    @ApiResponse({ status: 201, description: "Item adicionado com sucesso" })
    @ApiResponse({ status: 400, description: "Requisição inválida" })
    @HttpCode(HttpStatus.CREATED)
    createItemByTab(@Param('tabId') tabId: string, @Body() createTabItemDto: CreateTabItemDto, @Req() req,) {
        const userId = req.user?.sub
        return this.tabItemService.createItemByTab(tabId, createTabItemDto, userId);
    }

    @Post('bulk/by-tab/:tabId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MANAGER, UserRole.WAITER)
    @ApiOperation({ summary: "Adicionar vários items a uma comanda pelo ID da comanda" })
    @ApiBody({ type: CreateManyTabItemsDto })
    @ApiResponse({ status: 201, description: "Items adicionados com sucesso" })
    @ApiResponse({ status: 400, description: "Requisição inválida" })
    @HttpCode(HttpStatus.CREATED)
    createItemsByTab(@Param('tabId') tabId: string, @Body() createManyTabItemsDto: CreateManyTabItemsDto, @Req() req,) {
        const userId = req.user?.sub
        return this.tabItemService.createItemsByTab(tabId, createManyTabItemsDto, userId);
    }

    @Get('by-tab/:tabId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MANAGER, UserRole.WAITER)
    @ApiOperation({ summary: 'Listar items de uma comanda' })
    @ApiResponse({ status: 200, description: 'Lista de items' })
    findItemsByTab(@Param('tabId') tabId: string) {
        return this.tabItemService.findItemsByTab(tabId);
    }

    @Patch(':id/quantity')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MANAGER, UserRole.WAITER)
    @ApiOperation({ summary: 'Atualizar quantidade de um item' })
    @ApiBody({ type: UpdateTabItemDto })
    @ApiResponse({ status: 200, description: 'Quantidade atualizada' })
    updateItemQuantity(@Param('id') id: string, @Body() body: UpdateTabItemDto) {
        return this.tabItemService.updateItemQuantity(id, body.quantity);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MANAGER, UserRole.WAITER)
    @ApiOperation({ summary: 'Remover um item da comanda' })
    @ApiResponse({ status: 204, description: 'Item removido' })
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteItem(@Param('id') id: string) {
        return this.tabItemService.deleteItem(id);
    }


}