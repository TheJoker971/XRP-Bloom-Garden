import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...\n');

  // Nettoyer la base de données
  console.log('🧹 Nettoyage de la base de données...');
  await prisma.event.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.association.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Base de données nettoyée\n');

  // 1. Créer l'administrateur
  console.log('👨‍💼 Création de l\'administrateur...');
  const adminPassword = await hashPassword('admin123');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@xrpbloomgarden.com',
      password: adminPassword,
      name: 'Administrateur Principal',
      role: 'ADMIN',
    },
  });

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
    },
  });
  console.log('✅ Admin créé: admin@xrpbloomgarden.com / admin123\n');

  // 2. Créer des associations
  console.log('🏢 Création des associations...');
  
  const associationsData = [
    {
      email: 'contact@greenforest.org',
      password: await hashPassword('forest123'),
      name: 'Green Forest Alliance',
      type: 'nature',
      description: 'Association dédiée à la protection et la reforestation des forêts tropicales. Nous plantons plus de 10 000 arbres par an.',
      website: 'https://greenforest.org',
      status: 'APPROVED',
      walletAddress: 'rN7n7otQDd6FczFgLdlqtyMVrn3HMfXoZM',
    },
    {
      email: 'info@oceanblue.org',
      password: await hashPassword('ocean123'),
      name: 'Ocean Blue Conservation',
      type: 'eau',
      description: 'Protection des océans et de la vie marine. Nettoyage des plages et sensibilisation à la pollution plastique.',
      website: 'https://oceanblue.org',
      status: 'APPROVED',
      walletAddress: 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY',
    },
    {
      email: 'contact@helpinghearts.org',
      password: await hashPassword('hearts123'),
      name: 'Helping Hearts',
      type: 'humanitaire',
      description: 'Aide humanitaire internationale. Nous apportons nourriture, eau et soins médicaux aux populations dans le besoin.',
      website: 'https://helpinghearts.org',
      status: 'APPROVED',
      walletAddress: 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1',
    },
    {
      email: 'info@cleanair.org',
      password: await hashPassword('air123'),
      name: 'Clean Air Initiative',
      type: 'air',
      description: 'Lutte contre la pollution atmosphérique et promotion des énergies renouvelables.',
      website: 'https://cleanair.org',
      status: 'PENDING',
      walletAddress: null,
    },
    {
      email: 'contact@firefighters.org',
      password: await hashPassword('fire123'),
      name: 'Forest Fire Prevention',
      type: 'feu',
      description: 'Prévention et lutte contre les incendies de forêt. Formation des populations locales et équipement des pompiers.',
      website: 'https://firefighters.org',
      status: 'APPROVED',
      walletAddress: 'rLHzPsX6oXkzU9rFYentvBz5FBrqtMxoPb',
    },
    {
      email: 'contact@earthguardians.org',
      password: await hashPassword('earth123'),
      name: 'Earth Guardians',
      type: 'nature',
      description: 'Protection de la biodiversité et des écosystèmes naturels.',
      website: null,
      status: 'REJECTED',
      walletAddress: null,
    },
  ];

  for (const assocData of associationsData) {
    const user = await prisma.user.create({
      data: {
        email: assocData.email,
        password: assocData.password,
        name: assocData.name,
        role: 'ASSOCIATION',
      },
    });

    await prisma.association.create({
      data: {
        userId: user.id,
        name: assocData.name,
        type: assocData.type,
        description: assocData.description,
        website: assocData.website,
        status: assocData.status,
        walletAddress: assocData.walletAddress,
      },
    });

    console.log(`  ✓ ${assocData.name} (${assocData.status})`);
  }
  console.log('✅ Associations créées\n');

  // 3. Créer des utilisateurs
  console.log('👥 Création des utilisateurs...');
  
  const usersData = [
    {
      email: 'alice@example.com',
      password: await hashPassword('alice123'),
      name: 'Alice Martin',
    },
    {
      email: 'bob@example.com',
      password: await hashPassword('bob123'),
      name: 'Bob Dupont',
    },
    {
      email: 'charlie@example.com',
      password: await hashPassword('charlie123'),
      name: 'Charlie Bernard',
    },
    {
      email: 'diana@example.com',
      password: await hashPassword('diana123'),
      name: 'Diana Rousseau',
    },
  ];

  for (const userData of usersData) {
    await prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: 'USER',
      },
    });
    console.log(`  ✓ ${userData.name}`);
  }
  console.log('✅ Utilisateurs créés\n');

  // 4. Créer un événement
  console.log('🔥 Création de l\'événement "Le Brasier des Cimes"...');
  await prisma.event.create({
    data: {
      name: 'Le Brasier des Cimes',
      description: 'Événement spécial : Sauvez la forêt des flammes ! Chaque don compte double pour éteindre le brasier.',
      type: 'boss',
      status: 'active',
      currentHealth: 750,
      maxHealth: 1000,
      multiplier: 2.0,
      rewardNFT: 'ipfs://QmIgnisHeroNFT123456',
    },
  });
  console.log('✅ Événement créé (750/1000 HP restants)\n');

  // 5. Créer le héros Ignis
  console.log('🦸 Création du héros "Ignis"...');
  const event = await prisma.event.findFirst({ where: { name: 'Le Brasier des Cimes' } });
  await prisma.hero.create({
    data: {
      name: 'Ignis, le Soldat du Feu',
      description: 'Un héros légendaire qui a combattu les flammes pour sauver la forêt. Récompense exclusive pour les meilleurs donateurs.',
      imageUrl: 'ipfs://QmIgnisHeroImage123456',
      rarity: 'legendary',
      eventId: event?.id,
    },
  });
  console.log('✅ Héros "Ignis" créé\n');

  console.log('🎉 Seed terminé avec succès!\n');
  console.log('📋 Récapitulatif:');
  console.log('  • 1 Administrateur');
  console.log('  • 6 Associations (4 approuvées, 1 en attente, 1 rejetée)');
  console.log('  • 4 Utilisateurs');
  console.log('  • 1 Événement actif');
  console.log('  • 1 Héros légendaire (Ignis)\n');
  console.log('🔑 Identifiants de test:');
  console.log('  Admin: admin@xrpbloomgarden.com / admin123');
  console.log('  Asso 1: contact@greenforest.org / forest123');
  console.log('  Asso 2: info@oceanblue.org / ocean123');
  console.log('  User 1: alice@example.com / alice123');
  console.log('  User 2: bob@example.com / bob123\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

