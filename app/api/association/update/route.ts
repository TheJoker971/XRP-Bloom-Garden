import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'ASSOCIATION') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, type, address, phone, website, logo, walletAddress } = body;

    const association = await prisma.association.update({
      where: { userId: decoded.userId },
      data: {
        name: name || undefined,
        description: description || undefined,
        type: type || undefined,
        address: address || undefined,
        phone: phone || undefined,
        website: website || undefined,
        logo: logo || undefined,
        walletAddress: walletAddress || undefined,
      },
    });

    return NextResponse.json({
      message: 'Informations mises à jour',
      association,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

