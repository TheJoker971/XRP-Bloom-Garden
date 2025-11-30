import { prisma } from './prisma';
import { hashPassword } from './auth';

export async function seedAdmin() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('Admin déjà existant');
      return;
    }

    // Créer l'admin par défaut
    const hashedPassword = await hashPassword('admin123'); // Changez ce mot de passe !

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@xrpbloomgarden.com',
        password: hashedPassword,
        name: 'Administrateur',
        role: 'ADMIN',
      },
    });

    await prisma.admin.create({
      data: {
        userId: adminUser.id,
      },
    });

    console.log('✅ Admin créé avec succès');
    console.log('Email: admin@xrpbloomgarden.com');
    console.log('Mot de passe: admin123');
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  }
}

