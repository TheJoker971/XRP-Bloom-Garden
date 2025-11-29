import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const eventId = params.id;

    // Récupérer l'événement
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        contributions: {
          select: {
            walletAddress: true,
            amount: true,
            tickets: true,
            damage: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Événement introuvable' },
        { status: 404 }
      );
    }

    // Calculer le leaderboard
    const contributorMap = new Map<string, { totalAmount: number; totalTickets: number; totalDamage: number; contributions: number }>();
    
    event.contributions.forEach(contrib => {
      const current = contributorMap.get(contrib.walletAddress) || {
        totalAmount: 0,
        totalTickets: 0,
        totalDamage: 0,
        contributions: 0,
      };
      
      contributorMap.set(contrib.walletAddress, {
        totalAmount: current.totalAmount + contrib.amount,
        totalTickets: current.totalTickets + contrib.tickets,
        totalDamage: current.totalDamage + contrib.damage,
        contributions: current.contributions + 1,
      });
    });

    const leaderboard = Array.from(contributorMap.entries())
      .map(([walletAddress, stats]) => ({
        walletAddress,
        ...stats,
      }))
      .sort((a, b) => b.totalTickets - a.totalTickets)
      .slice(0, 10);

    return NextResponse.json({
      event: {
        id: event.id,
        name: event.name,
        description: event.description,
        type: event.type,
        status: event.status,
        currentHealth: event.currentHealth,
        maxHealth: event.maxHealth,
        multiplier: event.multiplier,
        healthPercentage: (event.currentHealth / event.maxHealth) * 100,
        startDate: event.startDate,
        endDate: event.endDate,
      },
      leaderboard,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

