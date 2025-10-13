import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @ApiProperty() @IsNotEmpty() name!: string;
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty() @MinLength(6) password!: string;
  @ApiProperty({ enum: Role }) @IsEnum(Role) role!: Role;
}
