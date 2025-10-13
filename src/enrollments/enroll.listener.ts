import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EnrollListener {
  private logger = new Logger(EnrollListener.name);

  @OnEvent('enrollment.created')
  handle(payload: any) {
    this.logger.log(`EventEmitter: student ${payload.studentId} enrolled course ${payload.courseId}`);
  }
}
