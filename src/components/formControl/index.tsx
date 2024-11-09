import { UIEvent, useMemo, useState } from "react";
import { Form, FormInstance, Input, Select, Space, Switch } from "antd";
import FormItem, { FormItemProps } from "antd/es/form/FormItem";
import { ItemSelect } from "../../interfaces/components/formControl";
import { InputType } from "../../types/components/formControl";
import { ruleEmail, ruleLargeMaxLength, ruleMaxLength, rulePassword, rulePhone } from "../../constants";
import { Rule } from "antd/es/form";

export interface PropsItemFilters<T> {
  input: InputType<T>;
  onPopupScroll: (e: UIEvent<HTMLDivElement, globalThis.UIEvent>, item: ItemSelect<keyof T>) => Promise<void>;
  onSearchSelect: (search: string) => void;
  form?: FormInstance<T>;
}

const FormControl = <T extends { password?: string; confirmPassword?: string; }>({ input, onPopupScroll, form }: PropsItemFilters<T>) => {
  const id = Form.useWatch('id', form);
  const password = Form.useWatch('password', form);
  const confirmPassword = Form.useWatch('confirmPassword', form);

  const [searchValues, setSearchValues] = useState<{ id: string, value: string; }[]>([]);
  const { name, type, label, style, placeholder, rules } = input;
  const nameString = name as string;

  const baseFormItemProps: FormItemProps = {
    name: nameString,
    label: label,
    style: style,
  } as const;

  const _ruleMaxLength = name !== "id" ? [ruleMaxLength] : [];

  const rulesPassword = useMemo(() => {
    const rules: Rule[] = [rulePassword, ruleMaxLength];

    if (!id) return rules;

    if (id && (password || confirmPassword)) return rules;

    return [];
  }, [id, password, confirmPassword]);

  return (
    <div style={{ padding: 5 }}>
      {
        (!type || type === "input") && <FormItem
          {...baseFormItemProps}
          rules={[...rules || [], ..._ruleMaxLength]}
        >
          <Input
            style={style}
            placeholder={placeholder}
          />
        </FormItem>
      }
      {
        type === "number" && <FormItem
          {...baseFormItemProps}
          rules={rules}
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
        type === "email" && <FormItem
          {...baseFormItemProps}
          rules={[ruleEmail, ruleMaxLength]}
        >
          <Input
            type="email"
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
          rules={rulesPassword}
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
          rules={[...rules || [], ruleLargeMaxLength]}
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
          <Select
            style={style}
            options={input.options}
            loading={input.loading}
            placeholder={placeholder}
            onPopupScroll={e => onPopupScroll?.(e, input)}
            filterOption={(input, option) =>
              ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
            }
            allowClear={true}
            /*  onSearch={(value) => setSearchValues(prev => {
               const searchValue = prev.find(search => search.id === name);
 
               if (searchValue) {
                 return [...prev, { id: name.toString(), value }];
               }
 
               return [];
             })} */
            searchValue={searchValues.find(search => search.id === name)?.value || ""}
          />
          {/*  <Button
              icon={<SearchOutlined />}
              onClick={() => onSearchSelect?.(input.searchValue || "")}
            /> */}
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