import { UploadFile } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { Timestamp } from "firebase/firestore";
import { SizesTires } from "../types/traila";

export interface Traila extends Tires {
  readonly id?: string;
  name: string;
  category: string;
  tiresChanged: number;
  createdAt: Date | Timestamp;
  createdAtFormated?: string;
  updatedAt: Date | Timestamp;
  updatedAtFormated?: string;
  createdBy: string;
  createdByEmail: string;
  aligned?: boolean;
  aligning?: boolean;
  sizesTires?: SizesTires;
}

export interface UploadTiresChangedByTraila {
  name: string;
  side: string;
  size: string;
}

export interface TiresChangedByTraila extends Tires, SizeTires {
  id?: string;
  idTraila: string;
  name: string;
  category: string;

  createdAt?: Date | Timestamp;
  createdAtFormated?: string;
  createdBy: string;
  createdByEmail: string;
  repairOrders: string[] | UploadChangeParam<UploadFile<any>>;
  sizesTires?: SizesTires;
  notes?: string;
}

export interface Tires {
  tire1: number;
  tire2: number;
  tire3: number;
  tire4: number;
  tire5: number;
  tire6: number;
  tire7: number;
  tire8: number;
}

export interface SizeTires {
  sizeTire1?: string;
  sizeTire2?: string;
  sizeTire3?: string;
  sizeTire4?: string;
  sizeTire5?: string;
  sizeTire6?: string;
  sizeTire7?: string;
  sizeTire8?: string;
}

export interface SizeTiresUpload {
  sizeTire1: string;
  sizeTire2: string;
  sizeTire3: string;
  sizeTire4: string;
  sizeTire5: string;
  sizeTire6: string;
  sizeTire7: string;
  sizeTire8: string;
}