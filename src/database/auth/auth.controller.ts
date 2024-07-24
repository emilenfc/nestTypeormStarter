import {
  Body,
  Controller,
  Post,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, ResetPasswordDto, RoleDto } from './dto/create-auth.dto';
import { Roles } from './roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';
import { RoleGuard } from './roles/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  signIn(
    @Body() authCredentialsDto: LoginDto,
  ): Promise<{ accessToken: string; user: any }> {
    return this.authService.login(authCredentialsDto);
  }

  @Patch('change-role/:userId')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  changeRole(
    @Param('userId') userId: string,
    @Body() role: RoleDto,
  ): Promise<any> {
    return this.authService.changeRole(userId, role);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    const { email, newPassword } = dto;
    return this.authService.resetPassword(email, newPassword);
  }
}
