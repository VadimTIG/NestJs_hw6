import { IsNotEmpty, IsString, ValidateIf, IsEnum } from 'class-validator';
import { Role } from 'src/auth/role/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  roles: Role;

  @ValidateIf((o) => o.avatar)
  avatar: string;
}
