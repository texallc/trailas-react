import { Dayjs } from "dayjs";

export interface Get<T> {
  total: number;
  list: Array<T>;
}

export interface DatesModel {
  createdAt?: string;
  updatedAt?: string;
  createdAtRange?: [Dayjs, Dayjs];
}