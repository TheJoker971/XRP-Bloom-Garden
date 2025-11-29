import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
// UserRole: 'ADMIN' | 'ASSOCIATION' | 'USER'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role === 'ADMIN' ? 'ADMIN' : role === 'ASSOCIATION' ? 'ASSOCIATION' : 'USER',
      },
    });

      // Si c'est une association, créer l'entrée Association
      if (user.role === 'ASSOCIATION') {
        const { associationType, description, website } = body;
        await prisma.association.create({
          data: {
            userId: user.id,
            name: name || 'Nouvelle Association',
            type: associationType || 'nature',
            description: description || null,
            website: website || null,
            status: 'PENDING',
          },
        });
      }

    // Si c'est un admin, créer l'entrée Admin
    if (user.role === 'ADMIN') {
      await prisma.admin.create({
        data: {
          userId: user.id,
        },
      });
    }

    // Générer le token
    const token = generateToken(user.id, user.email, user.role);

    return NextResponse.json(
      {
        message: 'Inscription réussie',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}

