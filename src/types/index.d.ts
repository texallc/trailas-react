import { Dispatch, SetStateAction } from "react";
import dayjs from "dayjs";

export type OptionsValue = string | number | Boolean | dayjs.Dayjs | null | undefined;
export type TypeControl = 'input' | 'select' | 'date' | 'checkbox' | 'radio' | 'autocomplete' | 'textarea' | 'file' | 'timeRangePicker' | 'phone';
export type TypeInput = 'text' | 'number' | 'password' | 'email';
export type TypeRoute = "create" | "update";
export type DS<T> = Dispatch<SetStateAction<T>>;


export type RecursivePartial<T> = NonNullable<T> extends object ? {
  [P in keyof T]?: NonNullable<T[P]> extends (infer U)[] ? RecursivePartial<U>[] : NonNullable<T[P]> extends object ? RecursivePartial<T[P]> : T[P];
} : T;