import { PartialType } from '@nestjs/swagger';
import { PolicyCreateDTO } from './policy.create.dto';

export class PolicyUpdateDTO extends PartialType(PolicyCreateDTO) {}
