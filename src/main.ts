import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressIp from 'express-ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(expressIp().getIpInfoMiddleware);
  // Escucha en todas las interfaces de red
  await app.listen(3000, '192.168.100.10');
  console.log(`Application is running on: http://192.168.100.10:3000`);

}
bootstrap();