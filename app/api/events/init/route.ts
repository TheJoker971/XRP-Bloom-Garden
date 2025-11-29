import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Initialiser l'événement "Le Brasier des Cimes"
export async function POST(request: NextRequest) {
  try {
    // Vérifier s'il y a déjà un événement actif
    const existingEvent = await prisma.event.findFirst({
      where: { status: 'active' },
    });

    if (existingEvent) {
      return NextResponse.json(
        { error: 'Un événement est déjà actif' },
        { status: 400 }
      );
    }

    // Créer le nouvel événement
    const event = await prisma.event.create({
      data: {
        name: 'Le Brasier des Cimes',
        description: 'Un incendie ravage la forêt ! Aidez GreenShield à l\'éteindre en achetant des packs. Chaque contribution compte double !',
        type: 'boss',
        status: 'active',
        currentHealth: 1000,
        maxHealth: 1000,
        multiplier: 2.0,
        rewardNFT: 'ipfs://ignis-hero-metadata',
      },
    });

    return NextResponse.json({
      message: 'Événement créé avec succès',
      event,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

