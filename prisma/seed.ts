import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...\n');

  // Nettoyer la base de données dans le bon ordre (dépendances)
  console.log('🧹 Nettoyage de la base de données...');
  await prisma.heroOwnership.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.eventContribution.deleteMany();
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

  // 4. Créer des événements
  console.log('🔥 Création des événements...');
  
  const event1 = await prisma.event.create({
    data: {
      name: 'Le Brasier des Cimes',
      description: 'Un incendie dévastateur menace la forêt. Aidez-nous à éteindre les flammes avant qu\'il ne soit trop tard !',
      type: 'boss',
      status: 'active',
      currentHealth: 750,
      maxHealth: 1000,
      multiplier: 2.0,
      rewardNFT: 'ipfs://QmIgnisHeroNFT123456',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 jours
    },
  });
  console.log('  ✓ Le Brasier des Cimes (ACTIF - 750/1000 HP)');

  const event2 = await prisma.event.create({
    data: {
      name: 'La Grande Sécheresse',
      description: 'Une sécheresse historique frappe la région. Chaque goutte d\'eau compte pour sauver les cultures.',
      type: 'boss',
      status: 'completed',
      currentHealth: 0,
      maxHealth: 800,
      multiplier: 1.5,
      rewardNFT: 'ipfs://QmAquaHeroNFT789',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // -14 jours
      endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // -7 jours
    },
  });
  console.log('  ✓ La Grande Sécheresse (TERMINÉ)');

  console.log('✅ Événements créés\n');

  // 5. Créer des héros
  console.log('🦸 Création des héros...');
  
  const heroIgnis = await prisma.hero.create({
    data: {
      name: 'Ignis, le Soldat du Feu',
      description: 'Un héros légendaire qui a combattu les flammes pour sauver la forêt. Récompense exclusive pour les meilleurs donateurs.',
      imageUrl: '/heroes/ignis.png',
      rarity: 'legendary',
      eventId: event1.id,
    },
  });
  console.log('  ✓ Ignis (Legendary)');

  const heroAqua = await prisma.hero.create({
    data: {
      name: 'Aqua, Gardienne des Eaux',
      description: 'Protectrice des océans et des rivières, elle apporte l\'eau là où elle manque.',
      imageUrl: '/heroes/aqua.png',
      rarity: 'legendary',
      eventId: event2.id,
    },
  });
  console.log('  ✓ Aqua (Legendary)');

  const heroTerra = await prisma.hero.create({
    data: {
      name: 'Terra, Esprit de la Terre',
      description: 'Gardien des forêts et de la nature, il fait pousser les arbres d\'un simple geste.',
      imageUrl: '/heroes/terra.png',
      rarity: 'epic',
    },
  });
  console.log('  ✓ Terra (Epic)');

  console.log('✅ Héros créés\n');

  // 6. Créer des contributions pour l'événement terminé
  console.log('📊 Création des contributions...');
  
  const demoWallets = [
    'rN7n7otQDd6FczFgLdlqtyMVrn3HMfXoZM',
    'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY',
    'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1',
    'rLHzPsX6oXkzU9rFYentvBz5FBrqtMxoPb',
  ];

  for (let i = 0; i < demoWallets.length; i++) {
    const numContributions = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numContributions; j++) {
      const isPremium = Math.random() > 0.6;
      await prisma.eventContribution.create({
        data: {
          eventId: event2.id,
          walletAddress: demoWallets[i],
          packType: isPremium ? 'premium' : 'basic',
          amount: isPremium ? 20 : 5,
          damage: isPremium ? 75 : 15, // avec multiplier 1.5
          tickets: isPremium ? 5 : 1,
          txHash: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        },
      });
    }
  }
  console.log('  ✓ Contributions créées pour "La Grande Sécheresse"');

  // Quelques contributions pour l'événement actif
  await prisma.eventContribution.create({
    data: {
      eventId: event1.id,
      walletAddress: demoWallets[0],
      packType: 'premium',
      amount: 20,
      damage: 100, // avec multiplier 2.0
      tickets: 5,
      txHash: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    },
  });
  console.log('  ✓ Contributions créées pour "Le Brasier des Cimes"');

  console.log('✅ Contributions créées\n');

  // 7. Attribuer des héros aux meilleurs contributeurs
  console.log('🏆 Attribution des héros...');
  
  await prisma.heroOwnership.create({
    data: {
      heroId: heroAqua.id,
      walletAddress: demoWallets[0],
      nftTokenId: `NFT_${Date.now()}_001`,
    },
  });
  console.log('  ✓ Aqua attribué au top contributeur');

  await prisma.heroOwnership.create({
    data: {
      heroId: heroTerra.id,
      walletAddress: demoWallets[1],
      nftTokenId: `NFT_${Date.now()}_002`,
    },
  });
  console.log('  ✓ Terra attribué à un contributeur');

  console.log('✅ Héros attribués\n');

  console.log('🎉 Seed terminé avec succès!\n');
  console.log('📋 Récapitulatif:');
  console.log('  • 1 Administrateur');
  console.log('  • 6 Associations (4 approuvées, 1 en attente, 1 rejetée)');
  console.log('  • 4 Utilisateurs');
  console.log('  • 2 Événements (1 actif, 1 terminé)');
  console.log('  • 3 Héros (2 Legendary, 1 Epic)');
  console.log('  • ~10 Contributions');
  console.log('  • 2 Héros attribués\n');
  console.log('🔑 Identifiants de test:');
  console.log('  Admin: admin@xrpbloomgarden.com / admin123');
  console.log('  Asso 1: contact@greenforest.org / forest123');
  console.log('  Asso 2: info@oceanblue.org / ocean123');
  console.log('  Asso 3: contact@helpinghearts.org / hearts123');
  console.log('  Asso 4: contact@firefighters.org / fire123');
  console.log('  User 1: alice@example.com / alice123');
  console.log('  User 2: bob@example.com / bob123\n');
  console.log('🎮 Événements:');
  console.log('  • Le Brasier des Cimes (ACTIF - 750/1000 HP)');
  console.log('  • La Grande Sécheresse (TERMINÉ)\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

