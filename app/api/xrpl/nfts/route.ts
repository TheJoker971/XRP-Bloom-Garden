import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'xrpl';

const XRPL_TESTNET_URL = 'wss://s.altnet.rippletest.net:51233';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Adresse manquante' },
        { status: 400 }
      );
    }

    const client = new Client(XRPL_TESTNET_URL);
    await client.connect();

    try {
      // Récupérer les NFTs de l'adresse
      const nfts = await client.request({
        command: 'account_nfts',
        account: address,
      });

      await client.disconnect();

      return NextResponse.json({
        nfts: nfts.result.account_nfts || [],
      });
    } catch (error: any) {
      await client.disconnect();
      
      // Si le compte n'existe pas ou n'a pas de NFTs
      if (error?.data?.error === 'actNotFound') {
        return NextResponse.json({ nfts: [] });
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des NFTs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des NFTs' },
      { status: 500 }
    );
  }
}

