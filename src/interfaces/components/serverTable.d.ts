import { ColumnsType } from "antd/es/table";
import { InputType } from "../../types/components/formControl";

export interface TableProps<T> {
  url?: string;
  propsUrl?: Record<string, string>;
  columns: ColumnsType<T>;
  filters?: InputType<T>[];
  showEdit?: boolean;
  showDisabled?: boolean;
  wait?: boolean;
}