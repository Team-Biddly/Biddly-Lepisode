import { PartialType } from '@nestjs/swagger';
import { BannerCreateDTO } from './banner.create.dto';

export class BannerUpdateDTO extends PartialType(BannerCreateDTO) {}
