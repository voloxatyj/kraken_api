/* eslint-disable indent */
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Server Instance');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  // const __prod__ = configService.get('ENVIRONMENT') === 'production';

  /*SWAGGER*/
  const config = new DocumentBuilder()
    .setTitle('KRAKEN')
    .setDescription('The KRAKEN API Documentation')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Log Env
  logger.log(`
                        #######################################
                           🚀[Environment Mode]: ${configService.get('ENVIRONMENT')}
                        #######################################
    `);

  // start server
  await app.listen(configService.get('PORT'), () => {
    logger.log(`
          ############################################################################
                  🚀[server]: Server is up and running @ ${configService.get(
                    'PROTOCOL',
                  )}://${configService.get('HOST')}:${configService.get('PORT')}
          ############################################################################
    `);
  });
}
bootstrap();
