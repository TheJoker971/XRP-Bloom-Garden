import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, packType, amount, txHash, eventId } = body;

    if (!walletAddress || !packType || !amount) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Récupérer l'événement (soit par ID, soit le premier actif)
    let event;
    if (eventId) {
      event = await prisma.event.findUnique({
        where: { id: eventId },
      });
    } else {
      event = await prisma.event.findFirst({
        where: { status: 'active' },
      });
    }

    if (!event) {
      return NextResponse.json(
        { error: 'Événement introuvable' },
        { status: 404 }
      );
    }

    if (event.status !== 'active') {
      return NextResponse.json(
        { error: 'Cet événement n\'est pas actif' },
        { status: 400 }
      );
    }

    if (event.currentHealth <= 0) {
      return NextResponse.json(
        { error: 'L\'événement est terminé' },
        { status: 400 }
      );
    }

    // Calculer les dégâts et tickets selon le pack
    let damage = 0;
    let tickets = 0;

    if (packType === 'basic') {
      damage = 10 * event.multiplier;
      tickets = 1;
    } else if (packType === 'premium') {
      damage = 50 * event.multiplier;
      tickets = 5;
    }

    // Créer la contribution
    const contribution = await prisma.eventContribution.create({
      data: {
        eventId: event.id,
        walletAddress,
        packType,
        amount,
        damage: Math.floor(damage),
        tickets,
        txHash,
      },
    });

    // Mettre à jour la santé de l'événement
    const newHealth = Math.max(0, event.currentHealth - Math.floor(damage));
    const updatedEvent = await prisma.event.update({
      where: { id: event.id },
      data: { 
        currentHealth: newHealth,
        status: newHealth <= 0 ? 'completed' : 'active',
      },
    });

    // Si l'événement est terminé, distribuer les récompenses
    let winner = false;
    let heroAwarded = false;
    if (newHealth <= 0) {
      try {
        // Trouver le top 3 des contributeurs
        const allContributions = await prisma.eventContribution.findMany({
          where: { eventId: event.id },
          select: { walletAddress: true, tickets: true },
        });

        const aggregatedContributions = new Map<string, number>();
        for (const c of allContributions) {
          aggregatedContributions.set(c.walletAddress, (aggregatedContributions.get(c.walletAddress) || 0) + c.tickets);
        }

        const topContributors = Array.from(aggregatedContributions.entries())
          .sort(([, ticketsA], [, ticketsB]) => ticketsB - ticketsA)
          .slice(0, 3)
          .map(([walletAddress, totalTickets]) => ({ walletAddress, totalTickets }));

        // Créer le héros Ignis s'il n'existe pas
        let hero = await prisma.hero.findFirst({
          where: { name: 'Ignis, le Soldat du Feu' },
        });

        if (!hero) {
          hero = await prisma.hero.create({
            data: {
              name: 'Ignis, le Soldat du Feu',
              description: 'Héros légendaire qui a combattu le Brasier des Cimes',
              imageUrl: '/heroes/ignis.png',
              rarity: 'legendary',
              eventId: event.id,
            },
          });
        }

        // Attribuer le héros aux top 3
        for (const contributor of topContributors) {
          const existing = await prisma.heroOwnership.findFirst({
            where: {
              heroId: hero.id,
              walletAddress: contributor.walletAddress,
            },
          });

          if (!existing) {
            await prisma.heroOwnership.create({
              data: {
                heroId: hero.id,
                walletAddress: contributor.walletAddress,
              },
            });
          }
        }
        
        heroAwarded = true;
        winner = topContributors.some(c => c.walletAddress === walletAddress);
      } catch (heroError) {
        console.error('Erreur lors de la distribution des héros:', heroError);
        // L'événement est terminé, mais la distribution des héros a échoué.
        // On ne renvoie pas d'erreur 500 pour ne pas faire disparaître l'événement.
      }
    }

    return NextResponse.json({
      contribution,
      event: {
        ...updatedEvent,
        healthPercentage: (updatedEvent.currentHealth / updatedEvent.maxHealth) * 100,
      },
      damage: Math.floor(damage),
      tickets,
      isWinner: winner,
      eventCompleted: newHealth <= 0,
      heroAwarded,
    });
  } catch (error) {
    console.error('Erreur lors de la contribution:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

