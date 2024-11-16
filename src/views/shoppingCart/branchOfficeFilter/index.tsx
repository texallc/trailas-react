import { Button, Col, Form, Row } from "antd";
import { useFormControl } from "../../../context/formControl";
import FormControl from "../../../components/formControl";
import { User } from "../../../interfaces/models/user";

const BranchOfficeFilter = ({ onSelectBranchOffice }: { onSelectBranchOffice: (id: number) => void; }) => {
  const { form, inputs } = useFormControl<User>();

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={({ id }) => onSelectBranchOffice(id)}
    >
      <Row align="middle" gutter={20}>
        <Col xs={12} md={7}>
          {
            inputs.map((input) => {
              return (
                <FormControl
                  key={input.name}
                  input={input}
                />
              );
            })
          }
        </Col>
        <Col xs={12}>
          <Button
            style={{ marginTop: 5 }}
            type="primary"
            htmlType="submit"
          >
            Seleccionar sucursal
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default BranchOfficeFilter;