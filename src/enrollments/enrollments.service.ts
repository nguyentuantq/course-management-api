import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnrollmentsService {
  private exchange: string;
  private routingKey: string;

  constructor(
    @InjectRepository(Enrollment) private repo: Repository<Enrollment>,
    @InjectRepository(Course) private courses: Repository<Course>,
    @InjectRepository(User) private users: Repository<User>,
    private events: EventEmitter2,
    private amqp: AmqpConnection,
    cfg: ConfigService,
  ) {
    this.exchange = cfg.get<string>('RABBIT_EXCHANGE')!;
    this.routingKey = cfg.get<string>('RABBIT_ROUTING_KEY')!;
  }

  async enroll(studentId: string, courseId: string) {
    const exists = await this.repo.findOne({ where: { student: { id: studentId }, course: { id: courseId } } });
    if (exists) throw new ConflictException('Already enrolled');

    const saved = await this.repo.save(
      this.repo.create({ student: { id: studentId } as any, course: { id: courseId } as any })
    );

    this.events.emit('enrollment.created', { studentId, courseId });
    await this.amqp.publish(this.exchange, this.routingKey, { studentId, courseId, at: Date.now() });
    return saved;
  }

  listStudents(courseId: string) {
    return this.repo.find({ where: { course: { id: courseId } } });
  }
}
