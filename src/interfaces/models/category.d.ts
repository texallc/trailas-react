import { DatesModel } from "..";
import { Product } from "./product";

export interface Category extends DatesModel {
  readonly id: number;
  name: string;
  description: string;
  image: string;
  active: boolean;
  products?: Product[];
}