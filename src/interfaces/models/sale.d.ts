import { DatesModel } from "..";
import { Status } from "../../types/models/movement";
import { SaleDetails } from "./saleDetails";
import { User } from "./user";

export interface Sale extends DatesModel {
  readonly id: number;
  total: number;
  subtotal: number;
  taxes: number;
  discount: number;
  status: Status;
  buyerId: number;
  buyer?: User;
  sellerId: number;
  seller?: User;
  details: SaleDetails[];
}