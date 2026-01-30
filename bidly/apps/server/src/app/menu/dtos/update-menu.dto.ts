import { CreateMenuDTO } from './create-menu.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMenuDTO extends PartialType(CreateMenuDTO) {
    // Add properties here
}