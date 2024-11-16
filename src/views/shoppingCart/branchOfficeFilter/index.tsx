import { Button, Col, Form, Row } from "antd";
import { useFormControl } from "../../../context/formControl";
import FormControl from "../../../components/formControl";
import { User } from "../../../interfaces/models/user";
import { InputType } from "../../../types/components/formControl";
import { DefaultOptionType } from "antd/es/select";
import { useState } from "react";


const BranchOfficeFilter = ({ onSelectBranchOffice }: { onSelectBranchOffice: (value: DefaultOptionType) => void; }) => {
  const { form, inputs } = useFormControl<User>();
  const [branchOfficeOption, setBranchOfficeOption] = useState<DefaultOptionType | null>(null);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={() => onSelectBranchOffice(branchOfficeOption!)}
    >
      <Row align="middle" gutter={20}>
        <Col xs={12} md={7}>
          {
            inputs.map((input) => {
              return (
                <FormControl
                  key={input.name}
                  input={{
                    ...input,
                    onChange: (value) => setBranchOfficeOption(value)
                  } as InputType<User>}
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