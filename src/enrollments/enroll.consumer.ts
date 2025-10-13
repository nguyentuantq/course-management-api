import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EnrollConsumer {
  private readonly logger = new Logger(EnrollConsumer.name);

  @RabbitSubscribe({
    exchange: process.env.RABBIT_EXCHANGE,
    routingKey: process.env.RABBIT_ROUTING_KEY,
    queue: process.env.RABBIT_QUEUE,
  })
  async handleEnroll(msg: { studentId: string; courseId: string; at: number }) {
    this.logger.log(`Simulate sending email: student ${msg.studentId} enrolled course ${msg.courseId} at ${new Date(msg.at).toISOString()}`);
  }
}
