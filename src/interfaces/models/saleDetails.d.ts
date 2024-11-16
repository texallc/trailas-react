import { Product } from "./product";
import { Sale } from "./sale";

export interface SalesDetail {
  readonly id?: number;
  quantity: number;
  saleId: number;
  sale: Sale;
  productId: number;
  product: Product;
}