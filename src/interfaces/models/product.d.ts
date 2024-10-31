import { Category } from "./category";

export interface Product {
  readonly id: number;
  uid?: string;
  name: string;
  price: number;
  brand: string;
  unitType: string;
  partNumber: string;
  description: string;
  active: boolean;
  image: string;
  category: Category;
  categoryId: number;
  stock?: number;
  inventoryId?: number;
}