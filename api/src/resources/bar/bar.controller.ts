import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BarService } from './bar.service';
import { CreateBarDto } from './dto/create-bar.dto';
import { UpdateBarDto } from './dto/update-bar.dto';

@Controller('bar')
export class BarController {
  constructor(private readonly barService: BarService) {}

  @Post()
  create(@Body() createBarDto: CreateBarDto) {
    return this.barService.create(createBarDto);
  }

  @Get()
  findAll() {
    return this.barService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBarDto: UpdateBarDto) {
    return this.barService.update(+id, updateBarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barService.remove(+id);
  }
}
