import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  User,
  BuyerProfile,
  SellerProfile,
} from '../database/entities';
import { UserRole, UserStatus } from '../common/enums';
import { RegisterDto } from './dto/auth.dto';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import type { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(BuyerProfile)
    private buyerProfileRepository: Repository<BuyerProfile>,
    @InjectRepository(SellerProfile)
    private sellerProfileRepository: Repository<SellerProfile>,
    private firebaseAdmin: FirebaseAdminService,
  ) {}

  async register(idToken: string, dto: RegisterDto) {
    const decoded = await this.firebaseAdmin.verifyIdToken(idToken);

    if (dto.role === UserRole.SUPER_COLD_ADMIN || dto.role === UserRole.ADMIN) {
      throw new UnauthorizedException('Cannot self-register as admin');
    }

    const existingByUid = await this.userRepository.findOne({
      where: { firebaseUid: decoded.uid },
      relations: ['adminProfile'],
    });
    if (existingByUid) {
      throw new ConflictException('User already registered');
    }

    const email = decoded.email;
    if (!email) {
      throw new BadRequestException('Firebase account must have an email');
    }

    const existingByEmail = await this.userRepository.findOne({
      where: { email },
      relations: ['adminProfile'],
    });

    if (existingByEmail) {
      if (existingByEmail.firebaseUid.startsWith('legacy-')) {
        existingByEmail.firebaseUid = decoded.uid;
        existingByEmail.name = dto.name;
        if (dto.phone) existingByEmail.phone = dto.phone;
        existingByEmail.emailVerified = decoded.email_verified ?? false;
        existingByEmail.status = UserStatus.ACTIVE;
        const linked = await this.userRepository.save(existingByEmail);
        return {
          user: this.sanitizeUser(linked),
          accessToken: idToken,
        };
      }
      throw new ConflictException('Email already registered');
    }

    const user = this.userRepository.create({
      firebaseUid: decoded.uid,
      name: dto.name,
      email,
      phone: dto.phone,
      role: dto.role,
      status: UserStatus.ACTIVE,
      emailVerified: decoded.email_verified ?? false,
    });

    const savedUser = await this.userRepository.save(user);

    if (dto.role === UserRole.BUYER) {
      await this.buyerProfileRepository.save(
        this.buyerProfileRepository.create({ userId: savedUser.id }),
      );
    } else if (dto.role === UserRole.SELLER) {
      await this.sellerProfileRepository.save(
        this.sellerProfileRepository.create({
          userId: savedUser.id,
          businessName: dto.businessName || dto.name,
        }),
      );
    }

    return {
      user: this.sanitizeUser(savedUser),
      accessToken: idToken,
    };
  }

  async login(idToken: string) {
    const decoded = await this.firebaseAdmin.verifyIdToken(idToken);
    let user = await this.findByFirebaseUid(decoded.uid);

    if (!user && decoded.email) {
      const byEmail = await this.userRepository.findOne({
        where: { email: decoded.email },
        relations: ['adminProfile'],
      });
      if (byEmail?.firebaseUid.startsWith('legacy-')) {
        byEmail.firebaseUid = decoded.uid;
        byEmail.emailVerified = decoded.email_verified ?? byEmail.emailVerified;
        user = await this.userRepository.save(byEmail);
      }
    }

    if (!user) {
      throw new UnauthorizedException(
        'Account not found. Please complete registration.',
      );
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account suspended');
    }

    if (decoded.email_verified && !user.emailVerified) {
      await this.userRepository.update(user.id, { emailVerified: true });
      user.emailVerified = true;
    }

    return {
      user: this.sanitizeUser(user),
      accessToken: idToken,
    };
  }

  async me(userId: string) {
    const user = await this.validateUser(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return this.sanitizeUser(user);
  }

  async logout(_userId: string) {
    return { message: 'Logged out successfully' };
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { firebaseUid },
      relations: ['adminProfile'],
    });
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['adminProfile'],
    });
  }

  async resolveFromToken(decoded: DecodedIdToken): Promise<{
    sub: string;
    email: string;
    role: string;
    permissions: string[];
    firebaseUid: string;
  }> {
    const user = await this.findByFirebaseUid(decoded.uid);
    if (!user) {
      throw new UnauthorizedException(
        'Account not found. Please complete registration.',
      );
    }
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account suspended');
    }
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.adminProfile?.permissions || [],
      firebaseUid: user.firebaseUid,
    };
  }

  private sanitizeUser(user: User) {
    const { adminProfile, buyerProfile, sellerProfile, ...rest } = user as User & {
      adminProfile?: unknown;
      buyerProfile?: unknown;
      sellerProfile?: unknown;
    };
    return {
      ...rest,
      permissions: (adminProfile as { permissions?: string[] } | undefined)
        ?.permissions,
    };
  }
}
