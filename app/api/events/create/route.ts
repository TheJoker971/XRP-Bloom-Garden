import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Vérifier que c'est une association approuvée
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { association: true },
    });

    if (!user || user.role !== 'ASSOCIATION' || !user.association) {
      return NextResponse.json(
        { error: 'Seules les associations peuvent créer des événements' },
        { status: 403 }
      );
    }

    if (user.association.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Votre association doit être approuvée pour créer un événement' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, maxHealth, multiplier, durationDays } = body;

    if (!name || !maxHealth || !durationDays) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'y a pas déjà un événement actif
    const activeEvent = await prisma.event.findFirst({
      where: { status: 'active' },
    });

    if (activeEvent) {
      return NextResponse.json(
        { error: 'Un événement est déjà actif. Veuillez attendre qu\'il se termine.' },
        { status: 400 }
      );
    }

    // Calculer la date de fin
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(durationDays));

    // Créer l'événement
    const event = await prisma.event.create({
      data: {
        name,
        description: description || `Événement de levée de fonds pour ${user.association.name}`,
        type: 'boss',
        status: 'active',
        currentHealth: parseInt(maxHealth),
        maxHealth: parseInt(maxHealth),
        multiplier: parseFloat(multiplier) || 2.0,
        endDate,
        rewardNFT: 'ipfs://QmIgnisHeroNFT', // URI du NFT Ignis
      },
    });

    return NextResponse.json({
      success: true,
      event,
      message: 'Événement créé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'événement' },
      { status: 500 }
    );
  }
}

