import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudyModule } from './study/study.module';

@Module({
  imports: [StudyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
