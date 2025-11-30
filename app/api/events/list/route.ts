import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Récupérer tous les événements actifs avec leurs contributions
    const events = await prisma.event.findMany({
      where: {
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
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

    // Calculer les statistiques pour chaque événement
    const eventsWithStats = events.map(event => {
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

      return {
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
        associationId: event.associationId,
        leaderboard,
        totalContributions: event.contributions.length,
        totalAmount: event.contributions.reduce((sum, c) => sum + c.amount, 0),
      };
    });

    return NextResponse.json({
      events: eventsWithStats,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

