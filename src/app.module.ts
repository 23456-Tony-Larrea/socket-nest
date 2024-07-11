import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AlertsGateway } from './alerts/alerts.gateway';
import { AlertsModule } from './alerts/alerts/alerts.module';

@Module({
  imports: [ChatModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService, AlertsGateway],
})
export class AppModule {}
