import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Adresse wallet requise' },
        { status: 400 }
      );
    }

    // Valider le format de l'adresse XRPL (commence par 'r' et fait 34 caractères)
    if (!/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Format d\'adresse XRPL invalide' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: { walletAddress },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { walletAddress: true },
    });

    return NextResponse.json({ walletAddress: user?.walletAddress || null });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

