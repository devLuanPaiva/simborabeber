import { PartialType } from '@nestjs/mapped-types';
import { CreateTabItemDto } from './create-tab-item.dto';

export class UpdateTabItemDto extends PartialType(CreateTabItemDto) {
  id: number;
}
