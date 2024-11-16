import { Inventory } from "../../interfaces/models/inventory";

export type ProductCart = Inventory & {
  [quantity: `quantity-${string}`]: number;
  [subTotal: `subTotal-${string}`]: number;
};