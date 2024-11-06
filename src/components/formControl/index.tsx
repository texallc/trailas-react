import { UIEvent, useState } from "react";
import { Button, Input, Select, Space } from "antd";
import FormItem from "antd/es/form/FormItem";
import { SearchOutlined } from "@ant-design/icons";
import { ItemSelect } from "../../interfaces/components/formControl";
import { InputType } from "../../types/components/formControl";

export interface PropsItemFilters<T> {
  input: InputType<T>;
  onPopupScroll: (e: UIEvent<HTMLDivElement, globalThis.UIEvent>, item: ItemSelect<keyof T>) => Promise<void>;
  onSearchSelect: (search: string) => void;
}

const FormControl = <T extends {}>({ input, onPopupScroll, onSearchSelect }: PropsItemFilters<T>) => {
  const [searchValues, setSearchValues] = useState<{ id: string, value: string; }[]>([]);
  const { name, type, label, style } = input;
  const nameString = name as string;

  return (
    <div>
      {
        (!type || type === "input") && <FormItem
          name={nameString}
          label={label}
          style={style}
        >
          <Input
            style={style}
            placeholder={(input.placeholder || "") as string}
          />
        </FormItem>
      }
      {
        type === "select" && <FormItem name={nameString}>
          <Space.Compact style={{ width: "100%" }}>
            <Select
              options={input.options}
              loading={input.loading}
              placeholder={input.placeholder}
              onPopupScroll={e => onPopupScroll?.(e, input)}
              showSearch={input.showSearch}
              filterOption={(input, option) =>
                ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
              }
              allowClear={true}
              onSearch={(value) => setSearchValues(prev => {
                const searchValue = prev.find(search => search.id === name);

                if (searchValue) {
                  return [...prev, { id: name.toString(), value }];
                }

                return [];
              })}
              searchValue={searchValues.find(search => search.id === name)?.value || ""}
            />
            {/*  <Button
              icon={<SearchOutlined />}
              onClick={() => onSearchSelect?.(input.searchValue || "")}
            /> */}
          </Space.Compact>
        </FormItem>
      }
    </div>
  );
};

export default FormControl;