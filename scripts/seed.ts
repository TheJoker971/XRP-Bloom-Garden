import { seedAdmin } from '../lib/seed-admin';

async function main() {
  console.log('🌱 Initialisation de la base de données...');
  await seedAdmin();
  console.log('✅ Terminé !');
  process.exit(0);
}

main().catch((error) => {
  console.error('Erreur:', error);
  process.exit(1);
});

