import { Form, FormProps, Input } from "antd";
import FormItem from "antd/es/form/FormItem";

interface Props extends FormProps {
  children?: React.ReactNode;
}

const BaseInputTraila = ({ children, ...formProps }: Props) => {
  return (
    <>
      <FormItem
        label="Nombre"
        name="name"
      >
        <Input
          placeholder="Nombre"
          name="name"
          disabled
        />
      </FormItem>
      <FormItem
        label="Categoria"
        name="category"
      >
        <Input
          placeholder="Categoria"
          name="category"
          disabled
        />
      </FormItem>
      {children}
    </>
  );
};

export default BaseInputTraila;