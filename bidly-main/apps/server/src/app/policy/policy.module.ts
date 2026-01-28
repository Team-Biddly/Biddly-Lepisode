import { Module } from '@nestjs/common';
import { PolicyController } from './controllers/policy.controller';
import { PolicyService } from './services/policy.service';

@Module({
    controllers: [PolicyController],
    providers: [PolicyService],
    exports: [PolicyService],
})
export class PolicyModule {}
