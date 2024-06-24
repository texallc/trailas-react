import { UploadFile } from "antd";
import { Timestamp } from "firebase/firestore";

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
  orderImage: string | UploadFile<any>[];
  changingTire?: boolean;
}

export interface TiresChangedByTraila extends Tires {
  idTraila: string;
  name: string;
  category: string;
  createdAt: Date | Timestamp;
  createdAtFormated?: string;
  createdBy: string;
  createdByEmail: string;
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