import { PartialType } from '@nestjs/swagger';
import { CreateTabDto } from './create-tab.dto';

export class UpdateTabDto extends PartialType(CreateTabDto) {}
