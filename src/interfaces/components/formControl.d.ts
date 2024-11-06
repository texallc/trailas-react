import { InputProps, SelectProps } from "antd";
import { Rule } from "antd/es/form";

interface BaseInputProps<K> {
  name: K;
  label?: string;
  rules?: Rule[];
}

export interface ItemInput<K> extends Omit<InputProps, "name">, BaseInputProps<K> {
  type?: "input";
}

export interface ItemSelect<K> extends Omit<SelectProps, "name">, BaseInputProps<K> {
  type: "select";
  keyValue?: string;
  keyLabel?: string;
  url?: string;
  page?: number;
}

export interface ItemPassword<K> extends Omit<ItemInput<K>, "type"> {
  type: "password";
}

export interface ItemPhone<K> extends Omit<ItemInput<K>, "type"> {
  type: "phone";
}

export interface SelectGet {
  list: SelectResponse[];
  total: number;
}

export interface SelectResponse {
  id: string;
  name?: string;
  email?: string;
}