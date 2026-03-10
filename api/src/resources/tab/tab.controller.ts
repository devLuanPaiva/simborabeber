import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TabService } from './tab.service';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';

@Controller('tab')
export class TabController {
  constructor(private readonly tabService: TabService) {}

  @Post()
  create(@Body() createTabDto: CreateTabDto) {
    return this.tabService.create(createTabDto);
  }

  @Get()
  findAll() {
    return this.tabService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tabService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTabDto: UpdateTabDto) {
    return this.tabService.update(+id, updateTabDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tabService.remove(+id);
  }
}
