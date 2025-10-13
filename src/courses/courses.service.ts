import { Injectable, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { Role } from '../common/enums/role.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private repo: Repository<Course>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async list() {
    const key = 'courses:list';
    const cached = await this.cache.get<Course[]>(key);
    if (cached) return cached;
    const data = await this.repo.find();
    await this.cache.set(key, data, 10_000);
    return data;
  }

  async findById(id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException();
    return c;
  }

  async create(dto: { title: string; description?: string }, user: { sub: string; role: Role }) {
    if (user.role !== Role.Instructor && user.role !== Role.Admin) throw new ForbiddenException();
    const course = this.repo.create({ ...dto, instructor: { id: user.sub } as any });
    const saved = await this.repo.save(course);
    await this.cache.del('courses:list');
    return saved;
  }

  async update(id: string, dto: any, user: { sub: string; role: Role }) {
    const course = await this.findById(id);
    if (user.role === Role.Instructor && course.instructor.id !== user.sub) throw new ForbiddenException();
    Object.assign(course, dto);
    const saved = await this.repo.save(course);
    await this.cache.del('courses:list');
    return saved;
  }

  async remove(id: string, user: { sub: string; role: Role }) {
    const course = await this.findById(id);
    if (user.role === Role.Instructor && course.instructor.id !== user.sub) throw new ForbiddenException();
    await this.repo.remove(course);
    await this.cache.del('courses:list');
    return { deleted: true };
  }
}
