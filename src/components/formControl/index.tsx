import { UIEvent, useState } from "react";
import { Button, Input, Select, Space, Switch } from "antd";
import FormItem, { FormItemProps } from "antd/es/form/FormItem";
import { SearchOutlined } from "@ant-design/icons";
import { ItemSelect } from "../../interfaces/components/formControl";
import { InputType } from "../../types/components/formControl";
import { ruleMaxLength, rulePassword, rulePhone } from "../../constants";

export interface PropsItemFilters<T> {
  input: InputType<T>;
  onPopupScroll: (e: UIEvent<HTMLDivElement, globalThis.UIEvent>, item: ItemSelect<keyof T>) => Promise<void>;
  onSearchSelect: (search: string) => void;
}

const FormControl = <T extends {}>({ input, onPopupScroll }: PropsItemFilters<T>) => {
  const [searchValues, setSearchValues] = useState<{ id: string, value: string; }[]>([]);
  const { name, type, label, style, placeholder, rules } = input;
  const nameString = name as string;

  const baseFormItemProps: FormItemProps = {
    name: nameString,
    label: label,
    style: style,
  } as const;

  return (
    <div style={{ padding: 5 }}>
      {
        (!type || type === "input") && <FormItem
          {...baseFormItemProps}
          rules={rules}
        >
          <Input
            style={style}
            placeholder={placeholder}
          />
        </FormItem>
      }
      {
        type === "phone" && <FormItem
          {...baseFormItemProps}
          rules={[rulePhone]}
        >
          <Input
            type="number"
            onKeyDown={e => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
              }

              return ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();
            }}
            onWheel={e => e.preventDefault()}
          />
        </FormItem>
      }
      {
        type === "password" && <FormItem
          {...baseFormItemProps}
          rules={[rulePassword, ruleMaxLength]}
        >
          <Input.Password
            style={style}
            placeholder={placeholder}
          />
        </FormItem>
      }
      {
        type === "textarea" && <FormItem
          {...baseFormItemProps}
          rules={rules}
        >
          <Input.TextArea
            style={style}
            placeholder={placeholder}
          />
        </FormItem>
      }
      {
        type === "select" && <FormItem
          {...baseFormItemProps}
          rules={rules}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Select
              style={style}
              options={input.options}
              loading={input.loading}
              placeholder={placeholder}
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
      {
        type === "switch" && <FormItem
          {...baseFormItemProps}
          valuePropName="checked"
          rules={rules}
        >
          <Switch />
        </FormItem>
      }
    </div>
  );
};

export default FormControl;