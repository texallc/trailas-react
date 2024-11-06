import { InputProps, SelectProps } from "antd";

export interface ItemInput<K> extends Omit<InputProps, "name"> {
  name: K;
  label: string;
  type?: "input";
}

export interface ItemSelect<K> extends Omit<SelectProps, "name"> {
  name: K;
  label?: string;
  type?: "select";
  keyValue?: string;
  keyLabel?: string;
  url?: string;
  page?: number;
  required?: boolean,
}

export interface SelectGet {
  list: SelectResponse[],
  total: number;
}

export interface SelectResponse {
  id: string;
  name?: string;
  email?: string;
}