import { Module } from '@nestjs/common';
import { IceBrakerModule } from './ice-braker/ice-braker.module';
import { LinkedinModule } from './linkedin/linkedin.module';
import { OpeniaModule } from './openia/openia.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LinkedinModule,
    OpeniaModule,
    IceBrakerModule,
  ],
})
export class AppModule {}
