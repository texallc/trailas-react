import { Roles } from "../../types/models/user";
import { Inventory } from "./inventory";
import { Movement } from "./movement";
import { Sale } from "./sale";

export interface User {
  readonly id: number;
  uid: string;
  readonly role: Roles;
  name: string;
  email: string;
  description: string;
  active: boolean;
  image: string;
  password?: string;
  rfc: string;
  phone: number;
  inventories?: Inventory[];
  movements?: Movement[];
  salesSeller?: Sale[];
  salesBuyer?: Sale[];
}
