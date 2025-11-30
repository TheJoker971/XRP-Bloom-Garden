import { Pack, Rarity, PackItem } from "./gameModels";

// Items Nature
const NATURE_ITEMS: PackItem[] = [
  { 
    id: "tree_small", 
    name: "Jeune Arbre", 
    rarity: Rarity.COMMON,
    imageUrl: "/images/pine.png",
    cardImageUrl: "/images/Pine_tree_card.png"
  },
  { 
    id: "rock", 
    name: "Rocher", 
    rarity: Rarity.COMMON,
    imageUrl: "/images/rock.png"
  },
  { 
    id: "flower", 
    name: "Fleurs", 
    rarity: Rarity.COMMON,
    imageUrl: "/images/flower.png"
  },
  { 
    id: "path", 
    name: "Chemin", 
    rarity: Rarity.COMMON,
    imageUrl: "/images/chemin.png",
    cardImageUrl: "/images/chemin_card.png"
  },
  { 
    id: "beehive", 
    name: "Ruche à Abeilles", 
    rarity: Rarity.RARE,
    imageUrl: "/images/beehive.png",
    cardImageUrl: "/images/Beehive_card.png"
  },
  { 
    id: "cabin", 
    name: "Cabane", 
    rarity: Rarity.RARE,
    imageUrl: "/images/cabane.png",
    cardImageUrl: "/images/cabane_card.png"
  },
  { 
    id: "sanctuary", 
    name: "Sanctuaire", 
    rarity: Rarity.EPIC,
    imageUrl: "/images/sanctuaire.png",
    cardImageUrl: "/images/sanctuaire_card.png"
  },
  { 
    id: "world_tree", 
    name: "Phoenix Tree", 
    rarity: Rarity.LEGENDARY,
    imageUrl: "/images/phoenix_tree.png",
    cardImageUrl: "/images/phoenix_card.png"
  },
];

// Items Événement Feu
const FIRE_EVENT_ITEMS: PackItem[] = [
  {
    id: "water_bucket",
    name: "Seau d'Eau",
    rarity: Rarity.COMMON,
    imageUrl: "/images/sceau_eau.png",
  },
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
  pack_fire_event: {
    id: "pack_fire_event",
    name: "Pack Événement Incendie",
    description: "Sceaux d'eau pour éteindre l'incendie",
    price: 5,
    category: "event",
    probabilities: {
      [Rarity.COMMON]: 100,
      [Rarity.RARE]: 0,
      [Rarity.EPIC]: 0,
      [Rarity.LEGENDARY]: 0,
    },
    pool: FIRE_EVENT_ITEMS,
  },
};
