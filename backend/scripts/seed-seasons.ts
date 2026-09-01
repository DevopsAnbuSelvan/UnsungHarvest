/**
 * Seeds default seasons for the product form.
 * Usage: npx ts-node -r tsconfig-paths/register scripts/seed-seasons.ts
 */
import { config } from 'dotenv';
import dataSource from '../src/database/data-source';
import { Season } from '../src/database/entities';

config();

const SEASONS = [
  { name: 'Summer', description: 'March to June', startMonth: 3, endMonth: 6 },
  { name: 'Monsoon', description: 'June to September', startMonth: 6, endMonth: 9 },
  { name: 'Winter', description: 'November to February', startMonth: 11, endMonth: 2 },
  { name: 'Spring', description: 'February to April', startMonth: 2, endMonth: 4 },
  { name: 'Year-round', description: 'Available throughout the year', startMonth: 1, endMonth: 12 },
];

async function main() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(Season);

  for (const season of SEASONS) {
    const existing = await repo.findOne({ where: { name: season.name } });
    if (!existing) {
      await repo.save(repo.create({ ...season, isActive: true }));
      console.log(`Created season: ${season.name}`);
    } else {
      console.log(`Season already exists: ${season.name}`);
    }
  }

  await dataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
