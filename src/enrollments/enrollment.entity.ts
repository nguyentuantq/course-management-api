import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity()
@Unique(['student', 'course'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @ManyToOne(() => User, u => u.enrollments, { eager: true })
  student!: User;

  @ManyToOne(() => Course, c => c.enrollments, { eager: true })
  course!: Course;
}
