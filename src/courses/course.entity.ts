import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Enrollment } from '../enrollments/enrollment.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() title!: string;
  @Column({ nullable: true }) description!: string;

  @ManyToOne(() => User, u => u.courses, { eager: true })
  instructor!: User;

  @OneToMany(() => Enrollment, e => e.course)
  enrollments!: Enrollment[];
}
