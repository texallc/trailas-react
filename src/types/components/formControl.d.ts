import { ItemInput, ItemPassword, ItemPhone, ItemSelect, ItemTextarea, ItemSwitch, ItemNumber } from "../../interfaces/components/formControl";

export type InputType<T> = ItemInput<keyof T> | ItemSelect<keyof T> | ItemPassword<keyof T> | ItemPhone<keyof T> | ItemTextarea<keyof T> | ItemSwitch<keyof T> | ItemNumber<keyof T>;