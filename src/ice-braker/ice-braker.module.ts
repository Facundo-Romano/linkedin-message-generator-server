import { Module } from '@nestjs/common';
import { IceBrakerController } from './ice-braker.controller';
import { LinkedinModule } from '../linkedin/linkedin.module';
import { OpeniaModule } from '../openia/openia.module';
import { ConfigModule } from '@nestjs/config';
import { IceBreakerService } from './ice-breaker.service';

@Module({
  imports: [ConfigModule, LinkedinModule, OpeniaModule],
  controllers: [IceBrakerController],
  providers: [IceBreakerService],
})
export class IceBrakerModule {} 