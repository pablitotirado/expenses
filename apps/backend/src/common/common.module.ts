import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [AppConfigModule],
  providers: [],
  exports: [AppConfigModule],
})
export class CommonModule {}
