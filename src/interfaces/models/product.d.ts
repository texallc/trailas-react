import { DatesModel } from "..";
import { Category } from "./category";

export interface Product extends DatesModel {
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