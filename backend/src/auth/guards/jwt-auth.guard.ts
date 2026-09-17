import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { FirebaseAdminService } from '../../firebase/firebase-admin.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private reflector: Reflector,
    private firebaseAdmin: FirebaseAdminService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: unknown;
    }>();

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Firebase ID token');
    }

    const idToken = authHeader.slice(7).trim();
    const decoded = await this.firebaseAdmin.verifyIdToken(idToken);
    request.user = await this.authService.resolveFromToken(decoded);
    return true;
  }
}
