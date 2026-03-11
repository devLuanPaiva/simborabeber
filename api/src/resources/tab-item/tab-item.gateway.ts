import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { TabItemService } from './tab-item.service';
import { CreateTabItemDto } from './dto/create-tab-item.dto';
import { UpdateTabItemDto } from './dto/update-tab-item.dto';

@WebSocketGateway()
export class TabItemGateway {
  constructor(private readonly tabItemService: TabItemService) {}

  @SubscribeMessage('createTabItem')
  create(@MessageBody() createTabItemDto: CreateTabItemDto) {
    return this.tabItemService.create(createTabItemDto);
  }

  @SubscribeMessage('findAllTabItem')
  findAll() {
    return this.tabItemService.findAll();
  }

  @SubscribeMessage('findOneTabItem')
  findOne(@MessageBody() id: number) {
    return this.tabItemService.findOne(id);
  }

  @SubscribeMessage('updateTabItem')
  update(@MessageBody() updateTabItemDto: UpdateTabItemDto) {
    return this.tabItemService.update(updateTabItemDto.id, updateTabItemDto);
  }

  @SubscribeMessage('removeTabItem')
  remove(@MessageBody() id: number) {
    return this.tabItemService.remove(id);
  }
}
