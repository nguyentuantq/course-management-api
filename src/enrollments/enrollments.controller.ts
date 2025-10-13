import { Controller, Post, Param, UseGuards, Req, Get } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/guards/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enroll: EnrollmentsService) {}

  @Roles(Role.Student)
  @Post(':courseId')
  enrollCourse(@Param('courseId') courseId: string, @Req() req: any) {
    return this.enroll.enroll(req.user.sub, courseId);
  }

  @Roles(Role.Instructor, Role.Admin)
  @Get('course/:courseId/students')
  list(@Param('courseId') courseId: string) {
    return this.enroll.listStudents(courseId);
  }
}
