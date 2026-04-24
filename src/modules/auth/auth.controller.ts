import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ActivateDto } from './dto/activate.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged in user' })
  getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.id);
  }

  @Get('activate')
  @ApiOperation({ summary: 'Validate activation token' })
  validateToken(@Query('token') token: string) {
    return this.authService.validateActivationToken(token);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Set password and activate account' })
  activate(@Body() dto: ActivateDto) {
    return this.authService.activateAccount(dto.token, dto.password);
  }
}