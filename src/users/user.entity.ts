import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { Course } from '../courses/course.entity';
import { Enrollment } from '../enrollments/enrollment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column({ unique: true }) email!: string;
  @Column() name!: string;
  @Column() passwordHash!: string;

  @Column({ type: 'enum', enum: Role, default: Role.Student })
  role!: Role;

  @OneToMany(() => Course, c => c.instructor)
  courses!: Course[];

  @OneToMany(() => Enrollment, e => e.student)
  enrollments!: Enrollment[];
}
