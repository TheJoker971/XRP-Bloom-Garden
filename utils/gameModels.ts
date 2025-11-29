export enum Rarity {
  COMMON = "COMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  probabilities: Record<Rarity, number>;
  pool: PackItem[];
}

export interface PackItem {
  id: string;
  name: string;
  rarity: Rarity;
  description?: string;
}

export interface DrawnItem extends PackItem {
  packId: string;
  packName: string;
}

