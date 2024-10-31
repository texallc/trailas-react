import { useEffect } from "react";
import { Button, Card, Col, Form, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import FormControl from "../../formControl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormControl } from "../../../context/formControl";

const Filters = <T extends {}>() => {
  const { items, onPopupScroll, onSearchSelect } = useFormControl<T>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    let defaultValues: T = {} as T;

    items.forEach(item => {
      const { name } = item;
      const nameString = name as string;

      let defaultValue: string | undefined = searchParams.get(nameString) || "";

      if (defaultValue && item.type === "select") {
        const options = item.options || [];

        defaultValue = options.find(option => option.value === defaultValue)?.value?.toString() || undefined;
      }

      defaultValues = {
        ...defaultValues,
        [nameString]: defaultValue
      };
    });

    form.setFieldsValue(defaultValues);
    form.submit();
  }, [form, items, searchParams]);

  return (
    <Card
      styles={{
        body: {
          marginBottom: 20
        }
      }}
    >
      <Form<T>
        onFinish={(values) => {
          //const url = await onSearch(values);

          //navigate("");
        }}
        form={form}
      >
        <Row
          justify="space-between"
          align="middle"
        >
          <Col>
            <h3>Filtros</h3>
          </Col>
          <Col>
            <Button
              htmlType="submit"
              shape="round"
              style={{ width: '100%' }}
              icon={<SearchOutlined />}
            >
              Buscar
            </Button>
          </Col>
        </Row>
        <Row style={{ marginBottom: -20 }} gutter={[10, 20]}>
          {
            items.map((item) => {
              const { name } = item;
              const nameString = name as string;

              return (
                <Col key={nameString} xs={24} md={8}>
                  <FormControl
                    item={item}
                    onPopupScroll={onPopupScroll}
                    onSearchSelect={onSearchSelect}
                  />
                </Col>
              );
            })
          }
        </Row>
      </Form>
    </Card>
  );
};

export default Filters;