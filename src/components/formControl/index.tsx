import { Dispatch, SetStateAction, UIEvent, useMemo, useState } from "react";
import { DatePicker, Form, FormInstance, GetProp, Input, InputNumber, Select, Switch, Upload, UploadFile, UploadProps } from "antd";
import FormItem, { FormItemProps } from "antd/es/form/FormItem";
import { ItemSelect } from "../../interfaces/components/formControl";
import { InputType } from "../../types/components/formControl";
import { ruleEmail, ruleLargeMaxLength, ruleMaxLength, rulePassword, rulePhone, rulePrice } from "../../constants";
import { Rule } from "antd/es/form";
import ImgCrop from "antd-img-crop";
import ButtonUpload from "../buttonUpload";

export interface PropsItemFilters<T> {
  input: InputType<T>;
  onPopupScroll?: (e: UIEvent<HTMLDivElement, globalThis.UIEvent>, item: ItemSelect<keyof T>) => Promise<void>;
  onSearchSelect?: (search: string) => void;
  form?: FormInstance<T>;
  fileListImage?: UploadFile[];
  setFileListImage?: Dispatch<SetStateAction<UploadFile<any>[]>>;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const FormControl = <T extends {}>({ input, onPopupScroll, form, fileListImage, setFileListImage }: PropsItemFilters<T>) => {
  const id = Form.useWatch('id', form);
  const password = Form.useWatch('password', form);
  const confirmPassword = Form.useWatch('confirmPassword', form);
  const [searchValues, setSearchValues] = useState<{ id: string, value: string; }[]>([]);
  const { name, type, label, style, placeholder, rules, disabled } = input;
  const nameString = name as string;

  const baseFormItemProps: FormItemProps = useMemo(() => ({
    name: nameString,
    label: label,
    style: style,
  }), [nameString, label, style]);

  const _ruleMaxLength = useMemo(() => name !== "id" ? [ruleMaxLength] : [], [name]);

  const rulesPassword = useMemo(() => {
    const rules: Rule[] = [rulePassword, ruleMaxLength];

    if (!id) return rules;

    if (id && (password || confirmPassword)) return rules;

    return [];
  }, [id, password, confirmPassword]);

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();

        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }

    const image = new Image();
    image.src = src;

    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <>
      {
        (!type || type === "input") && <FormItem
          {...baseFormItemProps}
          rules={[...rules || [], ..._ruleMaxLength]}
        >
          <Input
            style={style}
            placeholder={placeholder}
            disabled={disabled}
          />
        </FormItem>
      }
      {
        type === "number" && <FormItem
          {...baseFormItemProps}
          rules={rules}
        >
          <InputNumber
            style={{ width: '100%' }}
            type="number"
            onKeyDown={e => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
              }

              return ["e", "E", "+", "/", "%", "*", "$"].includes(e.key) && e.preventDefault();
            }}
            onWheel={e => e.preventDefault()}
            disabled={disabled}
            max={input.max}
            min={input.min}
          />
        </FormItem>
      }
      {
        type === "price" && <FormItem
          {...baseFormItemProps}
          rules={[rulePrice]}
        >
          <InputNumber<number>
            style={{ width: '100%' }}
            onKeyDown={e => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
              }

              return ["e", "E", "+", "-", "/", "%", "*", "$"].includes(e.key) && e.preventDefault();
            }}
            min={1}
            max={999_999}
            onWheel={e => e.preventDefault()}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
            disabled={disabled}
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
            disabled={disabled}
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

              return ["e", "E", "+", "-", "/", "%", "*", "$"].includes(e.key) && e.preventDefault();
            }}
            onWheel={e => e.preventDefault()}
            disabled={disabled}
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
            disabled={disabled}
            autoComplete="new-password"
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
            disabled={disabled}
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
            disabled={disabled}
            mode={input.mode}
            onChange={(e) => input.onChange?.({ value: e, title: input.options?.find(option => option.value === e)?.label?.toString() || "" })}
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
          <Switch
            disabled={disabled}
          />
        </FormItem>
      }
      {
        type === "image" && <FormItem
          {...baseFormItemProps}
          rules={rules}
        >
          <ImgCrop
            rotationSlider
            showGrid
            showReset
            modalTitle="Editar"
            modalCancel="Cancelar"
            modalOk="Aceptar"
            resetText="Reiniciar"
            beforeCrop={(file) => {
              if (!["image/png", "image/jpeg"].includes(file.type)) return false;
            }}
          >
            <Upload
              fileList={fileListImage}
              onChange={(e) => {
                if (!["image/png", "image/jpeg"].includes(e.file.type || "")) return;

                setFileListImage?.(e.fileList);
                input.onChange?.(e);
              }}
              onRemove={(e) => {
                setFileListImage?.(prev => prev.filter((file) => file.uid !== e.uid));
                input.onRemove?.(e);
              }}
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess?.("ok");
                }, 0);
              }}
              accept="image/png, image/jpeg"
              listType="picture-card"
              multiple={false}
              maxCount={1}
              onPreview={onPreview}
            >
              <ButtonUpload
                value={fileListImage || []}
              />
            </Upload>
          </ImgCrop>
        </FormItem >
      }
      {
        type === "date" && <FormItem
          {...baseFormItemProps}
          rules={rules}
        >
          <DatePicker.RangePicker
            showTime={input.showTime}
          />
        </FormItem>
      }
    </>
  );
};

export default FormControl;