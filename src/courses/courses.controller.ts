import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { Roles } from '../shared/guards/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private courses: CoursesService) {}

  @Get()
  list() { return this.courses.list(); }

  @Get(':id')
  get(@Param('id') id: string) { return this.courses.findById(id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Instructor, Role.Admin)
  @Post()
  create(@Body() dto: any, @Req() req: any) {
    return this.courses.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Instructor, Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    return this.courses.update(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Instructor, Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.courses.remove(id, req.user);
  }
}
