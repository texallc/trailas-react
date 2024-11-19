import { Product } from "./product";
import { User } from "./user";

export interface Inventory {
  readonly id: number;
  stock: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  products: Product[];
  user?: User;
  userId: number;
  product?: Product;
  productId: number;
  addStock?: number;
}