import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot(); // Carga las variables de entorno

const configService = new ConfigService();
export const AUTH_CONSTANTS = {
  JWT_SECRET: configService.get<string>('JWT_SECRET') || 'DEFAULT_SECRET',
  JWT_EXPIRATION_SECONDS:
    configService.get<number>('JWT_EXPIRATION_SECONDS') || 60,
  ADMIN_PASSWORD: configService.get<number>('ADMIN_PASSWORD'),
};
