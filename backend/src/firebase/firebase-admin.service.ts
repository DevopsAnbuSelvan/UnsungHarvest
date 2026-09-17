import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  App,
  cert,
  getApp,
  getApps,
  initializeApp,
  ServiceAccount,
} from 'firebase-admin/app';
import {
  Auth,
  DecodedIdToken,
  getAuth,
  UserRecord,
} from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private app: App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    if (getApps().length) {
      this.app = getApp();
      return;
    }

    this.app = initializeApp({
      credential: cert(this.resolveServiceAccount()),
      projectId: this.configService.get<string>('firebase.projectId'),
    });
  }

  private resolveServiceAccount(): ServiceAccount {
    const serviceAccountPath = this.configService.get<string>(
      'firebase.serviceAccountPath',
    );
    if (serviceAccountPath) {
      const absolute = path.isAbsolute(serviceAccountPath)
        ? serviceAccountPath
        : path.join(process.cwd(), serviceAccountPath);
      return JSON.parse(fs.readFileSync(absolute, 'utf8')) as ServiceAccount;
    }

    const projectId = this.configService.get<string>('firebase.projectId');
    const clientEmail = this.configService.get<string>('firebase.clientEmail');
    const privateKey = this.configService.get<string>('firebase.privateKey');

    if (projectId && clientEmail && privateKey) {
      return {
        projectId,
        clientEmail,
        privateKey,
      };
    }

    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY',
    );
  }

  get auth(): Auth {
    return getAuth(this.app);
  }

  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    try {
      return await this.auth.verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired Firebase token');
    }
  }

  async createUser(params: {
    email: string;
    password: string;
    displayName?: string;
  }): Promise<UserRecord> {
    return this.auth.createUser({
      email: params.email,
      password: params.password,
      displayName: params.displayName,
      emailVerified: true,
    });
  }

  async deleteUser(uid: string): Promise<void> {
    await this.auth.deleteUser(uid);
  }
}
