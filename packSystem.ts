import { Pack, Rarity, DrawnItem } from "../XRP-Bloom-Garden/gameModels";

/**
 * Tire un objet aléatoire d'un pack en respectant les probabilités
 */
export function drawFromPack(pack: Pack): DrawnItem {
  // 1. Déterminer la rareté selon les probabilités
  const rarity = drawRarity(pack.probabilities);
  
  // 2. Filtrer les items du pool selon la rareté tirée
  const itemsOfRarity = pack.pool.filter(item => item.rarity === rarity);
  
  // 3. Si aucun item de cette rareté, fallback sur COMMON
  if (itemsOfRarity.length === 0) {
    const commonItems = pack.pool.filter(item => item.rarity === Rarity.COMMON);
    if (commonItems.length === 0) {
      throw new Error(`Pack ${pack.id} has no items!`);
    }
    const item = commonItems[Math.floor(Math.random() * commonItems.length)];
    return { ...item, packId: pack.id, packName: pack.name };
  }
  
  // 4. Tirer un item aléatoire parmi ceux de la bonne rareté
  const selectedItem = itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
  
  return {
    ...selectedItem,
    packId: pack.id,
    packName: pack.name,
  };
}

/**
 * Détermine une rareté selon les probabilités données
 */
function drawRarity(probabilities: Record<Rarity, number>): Rarity {
  const roll = Math.random() * 100;
  let cumulative = 0;
  
  const rarities: Rarity[] = [
    Rarity.COMMON,
    Rarity.RARE,
    Rarity.EPIC,
    Rarity.LEGENDARY,
  ];
  
  for (const rarity of rarities) {
    cumulative += probabilities[rarity];
    if (roll < cumulative) {
      return rarity;
    }
  }
  
  return Rarity.COMMON;
}

/**
 * Simulation de 1000 tirages pour vérifier les probabilités
 */
export function simulate1000Draws(pack: Pack): Record<Rarity, number> {
  const stats: Record<Rarity, number> = {
    [Rarity.COMMON]: 0,
    [Rarity.RARE]: 0,
    [Rarity.EPIC]: 0,
    [Rarity.LEGENDARY]: 0,
  };
  
  for (let i = 0; i < 1000; i++) {
    const item = drawFromPack(pack);
    stats[item.rarity]++;
  }
  
  return stats;
}