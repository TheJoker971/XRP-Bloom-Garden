import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Récupérer toutes les associations approuvées avec une adresse wallet
    const associations = await prisma.association.findMany({
      where: {
        status: 'APPROVED',
        walletAddress: {
          not: null, // Seulement les associations avec une adresse wallet
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        walletAddress: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      associations,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des associations:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

