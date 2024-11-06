import { Rule } from "antd/es/form";
import { ItemInput, ItemPassword, ItemPhone, ItemSelect } from "../../interfaces/components/formControl";

export type InputType<T> = ItemInput<keyof T> | ItemSelect<keyof T> | ItemPassword<keyof T> | ItemPhone<keyof T>;