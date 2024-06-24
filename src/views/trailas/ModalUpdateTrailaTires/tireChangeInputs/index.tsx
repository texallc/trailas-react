import { Col, InputNumber, Row } from "antd";
import FormItem from "antd/es/form/FormItem";
import { initTires, nameTires } from "../../../../constants";

const TireChangeInputs = () => {
  return (
    <Row>
      {
        Object.keys(initTires).map((key, index) => (
          <Col key={key} xs={6}>
            <FormItem name={key} label={nameTires[index]}>
              <InputNumber
                name={key}
              />
            </FormItem>
          </Col>
        ))
      }
    </Row>
  );
};

export default TireChangeInputs;