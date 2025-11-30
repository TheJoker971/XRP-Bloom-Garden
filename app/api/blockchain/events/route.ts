import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, txHash, donationId, eventId, eventContributionId, metadata, status } = body;

    if (!type || !txHash) {
      return NextResponse.json(
        { error: 'Type et txHash requis' },
        { status: 400 }
      );
    }

    const blockchainEvent = await prisma.blockchainEvent.create({
      data: {
        type,
        txHash,
        donationId,
        eventId,
        eventContributionId,
        metadata: metadata ? JSON.stringify(metadata) : null,
        status: status || 'pending',
      },
    });

    return NextResponse.json({ event: blockchainEvent });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txHash = searchParams.get('txHash');
    const type = searchParams.get('type');
    const donationId = searchParams.get('donationId');
    const eventId = searchParams.get('eventId');

    const events = await prisma.blockchainEvent.findMany({
      where: {
        ...(txHash && { txHash }),
        ...(type && { type }),
        ...(donationId && { donationId }),
        ...(eventId && { eventId }),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

