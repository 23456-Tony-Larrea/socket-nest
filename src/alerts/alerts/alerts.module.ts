// En chat.module.ts o el archivo del módulo donde quieras usar AlertsGateway
import { Module } from '@nestjs/common';
import { AlertsGateway } from '../alerts.gateway'; // Asegúrate de que la ruta sea correcta

@Module({
  providers: [AlertsGateway]
})
export class AlertsModule {}