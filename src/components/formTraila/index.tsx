import { Form, FormProps, Input } from "antd";
import BaseInputsTraila from "../baseInputsTraila";

interface Props extends FormProps {
  children?: React.ReactNode;
}

const FormTraila = ({ children, ...formProps }: Props) => {
  return (
    <Form
      {...formProps}
      layout="vertical"
    >
      <BaseInputsTraila />
      {children}
    </Form>
  );
};

export default FormTraila;