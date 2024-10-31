import { ItemInput, ItemSelect } from "../../interfaces/components/formControl";

export type InputType<T> = ItemInput<keyof T> | ItemSelect<keyof T>;
