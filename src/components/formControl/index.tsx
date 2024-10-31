import { UIEvent, useState } from "react";
import { Button, Input, Select, Space } from "antd";
import FormItem from "antd/es/form/FormItem";
import { SearchOutlined } from "@ant-design/icons";
import { ItemSelect } from "../../interfaces/components/formControl";
import { InputType } from "../../types/components/formControl";

interface PropsItemFilters<T> {
  item: InputType<T>;
  onPopupScroll: (e: UIEvent<HTMLDivElement, globalThis.UIEvent>, item: ItemSelect<keyof T>) => Promise<void>;
  onSearchSelect: (search: string) => void;
}

const FormControl = <T extends {}>({ item, onPopupScroll, onSearchSelect }: PropsItemFilters<T>) => {
  const [searchValues, setSearchValues] = useState<{ id: string, value: string; }[]>([]);
  const { name, type } = item;
  const nameString = name as string;

  return (
    <>
      {
        (!type || type === "input") && <FormItem name={nameString}>
          <Input
            placeholder={(item.placeholder || "") as string}
          />
        </FormItem>
      }
      {
        type === "select" && <FormItem name={nameString}>
          <Space.Compact style={{ width: "100%" }}>
            <Select
              options={item.options}
              loading={item.loading}
              placeholder={item.placeholder}
              onPopupScroll={e => onPopupScroll?.(e, item)}
              showSearch={item.showSearch}
              filterOption={(input, option) =>
                ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
              }
              allowClear={true}
              onSearch={(value) => setSearchValues(prev => {
                const searchValue = prev.find(search => search.id === item.name);

                if (searchValue) {
                  return [...prev, { id: item.name.toString(), value }];
                }

                return [];
              })}
              searchValue={searchValues.find(search => search.id === item.name)?.value || ""}
            />
            <Button
              icon={<SearchOutlined />}
              onClick={() => onSearchSelect?.(item.searchValue || "")}
            />
          </Space.Compact>
        </FormItem>
      }
    </>
  );
};

export default FormControl;