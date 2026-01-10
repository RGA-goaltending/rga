// lib/packages.ts

export interface PackageTier {
  name: string;
  price: number;    // Single Session Price
  price5: number;   // 5 Session Price
  price10: number;  // 10 Session Price
}

export const packages: PackageTier[] = [
  {
    name: 'Individual',
    price: 135,
    price5: 125,
    price10: 110,
  },
  {
    name: 'Group of 2',
    price: 100,
    price5: 90,
    price10: 80,
  },
  {
    name: 'Group of 3',
    price: 85,
    price5: 75,
    price10: 65,
  },
];