import { Pack, Rarity, PackItem } from "../XRP-Bloom-Garden/gameModels";

// Items Nature
const NATURE_ITEMS: PackItem[] = [
  { id: "tree_small", name: "Jeune pin", rarity: Rarity.COMMON }, //https://drive.google.com/uc?export=view&id=1TnuABq5qfE1A3GagWle48pzOKBJzaEWn
  { id: "beehive", name: "Ruche à Abeilles", rarity: Rarity.RARE }, //https://drive.google.com/uc?export=view&id=1cwPn0KbJlglF3zpg5UfGCzvN5ghee1WF
  { id: "world_tree", name: "Phoenix tree", rarity: Rarity.LEGENDARY }, //https://drive.google.com/uc?export=view&id=1SLO_F4FsSN56Kl89flQEoNgVeAeZhN8L
];

// Packs
export const PACKS: Record<string, Pack> = {
  pack_nature_basic: {
    id: "pack_nature_basic",
    name: "Pack Nature Basique",
    description: "Des éléments naturels pour embellir votre village",
    price: 5,
    category: "nature",
    probabilities: {
      [Rarity.COMMON]: 70,
      [Rarity.RARE]: 20,
      [Rarity.EPIC]: 8,
      [Rarity.LEGENDARY]: 2,
    },
    pool: NATURE_ITEMS,
  },
  pack_nature_premium: {
    id: "pack_nature_premium",
    name: "Pack Gardien de la Forêt",
    description: "Des objets rares pour les vrais protecteurs de la nature",
    price: 15,
    category: "nature",
    probabilities: {
      [Rarity.COMMON]: 40,
      [Rarity.RARE]: 30,
      [Rarity.EPIC]: 20,
      [Rarity.LEGENDARY]: 10,
    },
    pool: NATURE_ITEMS,
  },
};