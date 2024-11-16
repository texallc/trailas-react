import { DatesModel } from "..";
import { Category } from "./category";
import { Inventory } from "./inventory";

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
  category?: Category;
  categoryId: number;
  stock?: number;
  inventories?: Inventory[];
  userIds?: number[];
}