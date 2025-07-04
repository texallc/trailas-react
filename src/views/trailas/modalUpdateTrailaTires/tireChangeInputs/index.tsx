import { Col, Divider, Input, InputNumber, Row, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { initSizeTires, initTires, nameTires, sizeTires } from "../../../../constants";
import { getArrayChunk } from "../../../../utils/functions";
import { DefaultOptionType } from "antd/es/select";

const tireKeys = Object.keys(initTires);
const sizeTireKeys = Object.keys(initSizeTires);
const chunkTireKeys = getArrayChunk(tireKeys, 4);
const optionsSizeTires: DefaultOptionType[] = sizeTires.map(sizeTire => ({ title: sizeTire, value: sizeTire }));

const TireChangeInputs = () => {
  return (
    <div>
      {
        chunkTireKeys.map((tiresKeys, indexRow) => (
          <Row key={indexRow} gutter={10}>
            {
              tiresKeys.map((tireKey, index) => (
                <Col key={tireKey} xs={6}>
                  <FormItem
                    name={tireKey}
                    label={nameTires[indexRow * 4 + index]}
                  >
                    <InputNumber style={{ width: "100%" }} />
                  </FormItem>
                  <FormItem
                    name={sizeTireKeys[indexRow * 4 + index]}
                  >
                    <Select
                      options={optionsSizeTires}
                      showSearch
                    />
                  </FormItem>
                </Col>
              ))
            }
            <Divider />
          </Row>
        ))
      }
      <FormItem
        name="notes"
        label="Notas"
      >
        <Input.TextArea rows={4} />
      </FormItem>
    </div>
  );
};

export default TireChangeInputs;
