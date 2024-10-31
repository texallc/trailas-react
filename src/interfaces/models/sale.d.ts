import { SaleDetails } from "./saleDetails";
import { User } from "./user";

export interface Sale {
  readonly id?: number;
  total: number;
  subtotal: number;
  saleTax: number;
  buyerId: number;
  buyer: User;
  sellerId: number;
  seller: User;
  details: SaleDetails[];
}