import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestLogger } from './logger.middleware';

@Module({})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogger).forRoutes('*');
  }
}
