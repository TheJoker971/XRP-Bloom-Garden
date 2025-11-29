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
    const leaderboard = await prisma.$queryRaw`
      SELECT 
        walletAddress,
        SUM(tickets) as totalTickets,
        SUM(damage) as totalDamage,
        SUM(amount) as totalAmount,
        COUNT(*) as contributions
      FROM event_contributions
      WHERE eventId = ${event.id}
      GROUP BY walletAddress
      ORDER BY totalTickets DESC
      LIMIT 10
    `;

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

