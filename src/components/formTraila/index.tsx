import { Form, FormProps, Input } from "antd";
import BaseInputTraila from "../baseInputTraila";

interface Props extends FormProps {
  children?: React.ReactNode;
}

const FormTraila = ({ children, ...formProps }: Props) => {
  return (
    <Form
      {...formProps}
      layout="vertical"
    >
      <BaseInputTraila />
      {children}
    </Form>
  );
};

export default FormTraila;