import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-ioredis-yet";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { CoursesModule } from "./courses/courses.module";
import { EnrollmentsModule } from "./enrollments/enrollments.module";
import { MessagingModule } from "./messaging/messaging.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.development", ".env"],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES: Joi.string().default("1d"),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        RABBIT_URL: Joi.string().required(),
        RABBIT_EXCHANGE: Joi.string().required(),
        RABBIT_QUEUE: Joi.string().required(),
        RABBIT_ROUTING_KEY: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        type: "postgres",
        host: cfg.get<string>("DB_HOST")!,
        port: cfg.get<number>("DB_PORT")!,
        username: cfg.get<string>("DB_USER")!,
        password: cfg.get<string>("DB_PASS")!,
        database: cfg.get<string>("DB_NAME")!,
        autoLoadEntities: true,
        synchronize: true, // DEV ONLY
      }),
      inject: [ConfigService],
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (cfg: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: cfg.get<string>("REDIS_HOST")!,
            port: cfg.get<number>("REDIS_PORT")!,
          },
        }),
        ttl: 10_000,
      }),
      inject: [ConfigService],
    }),

    EventEmitterModule.forRoot(),
    MessagingModule,
    CoreModule,
    SharedModule,
    UsersModule,
    AuthModule,
    CoursesModule,
    EnrollmentsModule,
  ],
})
export class AppModule {}
