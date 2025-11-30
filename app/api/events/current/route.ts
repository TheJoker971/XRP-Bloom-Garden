import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Récupérer l'événement actif
export async function GET(request: NextRequest) {
  try {
    const event = await prisma.event.findFirst({
      where: { status: 'active' },
      include: {
        contributions: {
          orderBy: { tickets: 'desc' },
          take: 10,
        },
      },
    });

    if (!event) {
      return NextResponse.json({ event: null });
    }

    // Calculer le leaderboard
    const allContributions = await prisma.eventContribution.findMany({
      where: { eventId: event.id },
      select: {
        walletAddress: true,
        tickets: true,
        damage: true,
        amount: true,
      },
    });

    // Agrégation JavaScript pour éviter les BigInt
    const aggregatedContributions = new Map<string, { totalTickets: number; totalDamage: number; totalAmount: number; contributions: number }>();
    for (const c of allContributions) {
      const current = aggregatedContributions.get(c.walletAddress) || { totalTickets: 0, totalDamage: 0, totalAmount: 0, contributions: 0 };
      aggregatedContributions.set(c.walletAddress, {
        totalTickets: current.totalTickets + c.tickets,
        totalDamage: current.totalDamage + c.damage,
        totalAmount: current.totalAmount + c.amount,
        contributions: current.contributions + 1,
      });
    }

    const leaderboard = Array.from(aggregatedContributions.entries())
      .map(([walletAddress, stats]) => ({ walletAddress, ...stats }))
      .sort((a, b) => b.totalTickets - a.totalTickets)
      .slice(0, 10);

    return NextResponse.json({
      event: {
        ...event,
        healthPercentage: (event.currentHealth / event.maxHealth) * 100,
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

