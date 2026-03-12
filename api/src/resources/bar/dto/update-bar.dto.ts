import { PartialType } from '@nestjs/swagger';
import { CreateBarDto } from './create-bar.dto';

export class UpdateBarDto extends PartialType(CreateBarDto) {}
