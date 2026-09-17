import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private extractBearer(authorization?: string): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Firebase ID token');
    }
    return authorization.slice(7).trim();
  }

  @Public()
  @Post('user_register_api')
  @ApiOperation({
    summary:
      'Complete registration after Firebase signup (Bearer = Firebase ID token)',
  })
  register(
    @Headers('authorization') authorization: string,
    @Body() dto: RegisterDto,
  ) {
    const idToken = this.extractBearer(authorization);
    return this.authService.register(idToken, dto);
  }

  @Public()
  @Post('user_login_api')
  @ApiOperation({
    summary: 'Sync login after Firebase sign-in (Bearer = Firebase ID token)',
  })
  login(@Headers('authorization') authorization: string) {
    const idToken = this.extractBearer(authorization);
    return this.authService.login(idToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('user_me_api')
  @ApiOperation({ summary: 'Get current Neon user profile' })
  me(@CurrentUser('sub') userId: string) {
    return this.authService.me(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('user_logout_api')
  @ApiOperation({ summary: 'Logout (client should also sign out of Firebase)' })
  logout(@CurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }
}
