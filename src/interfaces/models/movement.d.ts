import { TypeMovement } from "../../types/models/movement";
import { Inventory } from "./inventory";
import { Product } from "./product";
import { User } from "./user";

export interface Movement {
  readonly id?: number;
  quantity: number;
  createdAt?: Date;
  inventory?: Inventory;
  inventoryId: number;
  user?: User;
  userId: number;
  typeMovement: TypeMovement;
}