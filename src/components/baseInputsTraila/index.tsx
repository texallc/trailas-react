import { ReactNode } from "react";
import { FormProps, Input, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { dataSizesTire } from "../../constants";
import { DefaultOptionType } from "antd/es/select";

interface Props extends FormProps {
  children?: ReactNode;
  disableInputs?: boolean;
  categories?: string[];
  drivers?: string[];
}

const BaseInputsTraila = ({ children, disableInputs, categories, drivers }: Props) => {
  const optionsDataSizesTire: DefaultOptionType[] = dataSizesTire.map(sizesTire => ({ title: sizesTire, value: sizesTire }));
  const optionsCategories: DefaultOptionType[] = categories?.map(category => ({ title: category, value: category })) || [];
  const optionsDrivers: DefaultOptionType[] = drivers?.map(driver => ({ title: driver, value: driver })) || [];

  return (
    <>
      <FormItem
        name="id"
        style={{ display: "none" }}
      >
        <Input />
      </FormItem>
      <FormItem
        label="Nombre"
        name="name"
      >
        <Input
          disabled={disableInputs}
        />
      </FormItem>
      <FormItem
        label="Categoria"
        name="category"
      >
        <Select
          disabled={disableInputs}
          options={optionsCategories}
        />
      </FormItem>
      <FormItem
        label="Tipo de llanta"
        name="sizesTires"
      >
        <Select
          options={optionsDataSizesTire}
          disabled={disableInputs}
        />
      </FormItem>
      <FormItem
        label="Chofer"
        name="driver"
      >
        <Select
          disabled={disableInputs}
          options={optionsDrivers}
        />
      </FormItem>
      {children}
    </>
  );
};

export default BaseInputsTraila;