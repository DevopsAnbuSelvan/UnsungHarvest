/**
 * Seed demo buyers, sellers, and admins in Firebase + Neon.
 * Usage: npx ts-node -r tsconfig-paths/register scripts/seed-demo-users.ts
 */
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as entities from '../src/database/entities';
import {
  ApprovalStatus,
  UserRole,
  UserStatus,
} from '../src/common/enums';
import { User } from '../src/database/entities/user.entity';
import { AdminProfile } from '../src/database/entities/admin-profile.entity';
import { BuyerProfile } from '../src/database/entities/buyer-profile.entity';
import { SellerProfile } from '../src/database/entities/seller-profile.entity';

config();

type SeedUser = {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  department?: string;
  bio?: string;
  businessName?: string;
  businessDescription?: string;
};

const SEEDS: SeedUser[] = [
  {
    email: 'buyer1@unsungharvest.com',
    password: 'Buyer@123',
    name: 'Priya Buyer',
    phone: '9000000001',
    role: UserRole.BUYER,
    bio: 'Demo buyer — loves organic veggies',
  },
  {
    email: 'buyer2@unsungharvest.com',
    password: 'Buyer@123',
    name: 'Arun Buyer',
    phone: '9000000002',
    role: UserRole.BUYER,
    bio: 'Demo buyer — GI-tagged produce fan',
  },
  {
    email: 'seller1@unsungharvest.com',
    password: 'Seller@123',
    name: 'Kavitha Seller',
    phone: '9000000011',
    role: UserRole.SELLER,
    businessName: 'Green Valley Farms',
    businessDescription: 'Fresh vegetables from Coimbatore',
  },
  {
    email: 'seller2@unsungharvest.com',
    password: 'Seller@123',
    name: 'Ravi Seller',
    phone: '9000000012',
    role: UserRole.SELLER,
    businessName: 'Hill Spice Collective',
    businessDescription: 'Spices and millets from the Nilgiris',
  },
  {
    email: 'admin1@unsungharvest.com',
    password: 'Admin@123',
    name: 'Ops Admin One',
    phone: '9000000021',
    role: UserRole.ADMIN,
    department: 'Operations',
  },
  {
    email: 'admin2@unsungharvest.com',
    password: 'Admin@123',
    name: 'Ops Admin Two',
    phone: '9000000022',
    role: UserRole.ADMIN,
    department: 'Support',
  },
];

async function ensureFirebaseUser(
  email: string,
  password: string,
  name: string,
): Promise<string> {
  const auth = getAuth();
  try {
    const existing = await auth.getUserByEmail(email);
    await auth.updateUser(existing.uid, {
      password,
      displayName: name,
      emailVerified: true,
    });
    return existing.uid;
  } catch {
    const created = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: true,
    });
    return created.uid;
  }
}

async function upsertNeonUser(
  ds: DataSource,
  seed: SeedUser,
  firebaseUid: string,
): Promise<User> {
  const userRepo = ds.getRepository(User);
  let user = await userRepo.findOne({
    where: [{ email: seed.email }, { firebaseUid }],
  });

  if (user) {
    user.firebaseUid = firebaseUid;
    user.email = seed.email;
    user.name = seed.name;
    if (seed.phone) user.phone = seed.phone;
    user.role = seed.role;
    user.status = UserStatus.ACTIVE;
    user.emailVerified = true;
    return userRepo.save(user);
  }

  return userRepo.save(
    userRepo.create({
      firebaseUid,
      email: seed.email,
      name: seed.name,
      ...(seed.phone ? { phone: seed.phone } : {}),
      role: seed.role,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    }),
  );
}

async function ensureProfile(ds: DataSource, seed: SeedUser, user: User) {
  if (seed.role === UserRole.BUYER) {
    const repo = ds.getRepository(BuyerProfile);
    const existing = await repo.findOne({ where: { userId: user.id } });
    if (!existing) {
      await repo.save(
        repo.create({ userId: user.id, bio: seed.bio }),
      );
    }
    return;
  }

  if (seed.role === UserRole.SELLER) {
    const repo = ds.getRepository(SellerProfile);
    const existing = await repo.findOne({ where: { userId: user.id } });
    if (!existing) {
      await repo.save(
        repo.create({
          userId: user.id,
          businessName: seed.businessName || `${seed.name} Farm`,
          businessDescription: seed.businessDescription,
          status: ApprovalStatus.APPROVED,
          approvedAt: new Date(),
          commissionPercent: 5,
        }),
      );
    } else if (existing.status !== ApprovalStatus.APPROVED) {
      existing.status = ApprovalStatus.APPROVED;
      existing.approvedAt = existing.approvedAt || new Date();
      await repo.save(existing);
    }
    return;
  }

  if (seed.role === UserRole.ADMIN) {
    const repo = ds.getRepository(AdminProfile);
    const existing = await repo.findOne({ where: { userId: user.id } });
    if (!existing) {
      await repo.save(
        repo.create({
          userId: user.id,
          department: seed.department || 'Operations',
          permissions: [],
        }),
      );
    }
  }
}

async function main() {
  const saPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    './unsung-harvest-firebase-adminsdk-fbsvc-3ce27e0c5c.json';
  const absolute = path.isAbsolute(saPath)
    ? saPath
    : path.join(process.cwd(), saPath);
  const serviceAccount = JSON.parse(fs.readFileSync(absolute, 'utf8'));

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || 'unsung-harvest',
    });
  }

  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: Object.values(entities),
    ssl:
      process.env.DATABASE_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
    synchronize: false,
  });

  await ds.initialize();

  console.log('\nSeeding demo users...\n');

  for (const seed of SEEDS) {
    const firebaseUid = await ensureFirebaseUser(
      seed.email,
      seed.password,
      seed.name,
    );
    const user = await upsertNeonUser(ds, seed, firebaseUid);
    await ensureProfile(ds, seed, user);
    console.log(`OK  ${seed.role.padEnd(8)} ${seed.email} / ${seed.password}`);
  }

  await ds.destroy();
  console.log('\nDone.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
