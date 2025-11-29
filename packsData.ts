import { Pack, Rarity, PackItem } from "../XRP-Bloom-Garden/gameModels";

// Items Nature
const NATURE_ITEMS: PackItem[] = [
  { id: "tree_small", name: "Jeune Arbre", rarity: Rarity.COMMON },
  { id: "bush", name: "Buisson", rarity: Rarity.COMMON },
  { id: "rock", name: "Rocher", rarity: Rarity.COMMON },
  { id: "flower", name: "Fleurs", rarity: Rarity.COMMON },
  { id: "tree_large", name: "Chêne Centenaire", rarity: Rarity.RARE },
  { id: "beehive", name: "Ruche à Abeilles", rarity: Rarity.RARE },
  { id: "fountain", name: "Fontaine", rarity: Rarity.RARE },
  { id: "wind_turbine", name: "Éolienne", rarity: Rarity.EPIC },
  { id: "eco_sanctuary", name: "Sanctuaire Écologique", rarity: Rarity.EPIC },
  { id: "world_tree", name: "Arbre-Monde", rarity: Rarity.LEGENDARY },
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