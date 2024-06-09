import { UploadFile } from "antd";
import { Timestamp } from "firebase/firestore";

export interface Traila {
  readonly id?: string;
  name: string;
  category: string;
  tiresChanged: number;
  createdAt: Date | Timestamp;
  createdAtFormated?: string;
  updatedAt: Date | Timestamp;
  updatedAtFormated?: string;
  createdBy: string;
  orderImage: string | UploadFile<any>[];
  changingTire?: boolean;
}