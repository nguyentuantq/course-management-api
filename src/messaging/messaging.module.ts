import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        exchanges: [
          { name: cfg.get<string>("RABBIT_EXCHANGE")!, type: "topic" },
        ],
        uri: cfg.get<string>("RABBIT_URL")!,
        connectionInitOptions: { wait: true, timeout: 30000 },
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class MessagingModule {}
