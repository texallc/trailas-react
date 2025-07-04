import {
  ItemInput,
  ItemPassword,
  ItemPhone,
  ItemSelect,
  ItemTextarea,
  ItemSwitch,
  ItemNumber,
  ItemEmail,
  ItemPrice,
  ItemImage,
  ItemDate
} from "../../interfaces/components/formControl";

export type InputType<T> = ItemInput<keyof T>
  | ItemSelect<keyof T>
  | ItemPassword<keyof T>
  | ItemPhone<keyof T>
  | ItemTextarea<keyof T>
  | ItemSwitch<keyof T>
  | ItemNumber<keyof T>
  | ItemEmail<keyof T>
  | ItemPrice<keyof T>
  | ItemImage<keyof T>
  | ItemDate<keyof T>;