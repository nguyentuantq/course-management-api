import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollConsumer } from './enroll.consumer';
import { EnrollListener } from './enroll.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, Course, User]),
  ],
  providers: [EnrollmentsService, EnrollConsumer, EnrollListener],
  controllers: [EnrollmentsController],
})
export class EnrollmentsModule {}
