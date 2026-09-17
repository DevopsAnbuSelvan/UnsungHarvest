/**
 * One-off: create SUPER_COLD_ADMIN in Firebase + Neon.
 * Usage: npx ts-node -r tsconfig-paths/register scripts/create-super-admin.ts
 */
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as entities from '../src/database/entities';
import { UserRole, UserStatus } from '../src/common/enums';
import { User } from '../src/database/entities/user.entity';
import { AdminProfile } from '../src/database/entities/admin-profile.entity';

config();

const EMAIL = 'supercoldadmin@gmail.com';
const PASSWORD = '987654';
const NAME = 'Super Cold Admin';

async function main() {
  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
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

  const auth = getAuth();
  let firebaseUid: string;

  try {
    const existing = await auth.getUserByEmail(EMAIL);
    firebaseUid = existing.uid;
    await auth.updateUser(firebaseUid, {
      password: PASSWORD,
      displayName: NAME,
      emailVerified: true,
    });
    console.log('Updated existing Firebase user:', firebaseUid);
  } catch {
    const created = await auth.createUser({
      email: EMAIL,
      password: PASSWORD,
      displayName: NAME,
      emailVerified: true,
    });
    firebaseUid = created.uid;
    console.log('Created Firebase user:', firebaseUid);
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

  const userRepo = ds.getRepository(User);
  const adminRepo = ds.getRepository(AdminProfile);

  let user = await userRepo.findOne({
    where: [{ email: EMAIL }, { firebaseUid }],
    relations: ['adminProfile'],
  });

  if (user) {
    user.firebaseUid = firebaseUid;
    user.role = UserRole.SUPER_COLD_ADMIN;
    user.name = NAME;
    user.status = UserStatus.ACTIVE;
    user.emailVerified = true;
    user = await userRepo.save(user);
    console.log('Updated Neon user:', user.id);
  } else {
    user = await userRepo.save(
      userRepo.create({
        firebaseUid,
        email: EMAIL,
        name: NAME,
        role: UserRole.SUPER_COLD_ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      }),
    );
    console.log('Created Neon user:', user.id);
  }

  const profile = await adminRepo.findOne({ where: { userId: user.id } });
  if (!profile) {
    await adminRepo.save(
      adminRepo.create({
        userId: user.id,
        department: 'Platform',
        permissions: ['*'],
      }),
    );
    console.log('Created admin_profiles row');
  } else {
    console.log('Admin profile already exists');
  }

  await ds.destroy();
  console.log('Done.', { email: EMAIL, role: UserRole.SUPER_COLD_ADMIN });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
