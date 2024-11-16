import { DatesModel } from "..";
import { TypeMovement } from "../../types/models/movement";
import { Inventory } from "./inventory";
import { User } from "./user";

export interface Movement extends DatesModel {
  readonly id: number;
  quantity: number;
  inventory?: Inventory;
  inventoryId: number;
  user: User;
  userId: number;
  typeMovement: TypeMovement;
}