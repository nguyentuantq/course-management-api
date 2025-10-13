import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async register({ name, email, password, role }: { name: string; email: string; password: string; role: Role }) {
    const found = await this.repo.findOne({ where: { email } });
    if (found) throw new ConflictException('Email taken');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.repo.create({ name, email, passwordHash, role });
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
