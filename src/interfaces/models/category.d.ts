import { Product } from "./product";

export interface Category {
  readonly id: number;
  name: string;
  description: string;
  image: string;
  active: boolean;
  products?: Product[];
}