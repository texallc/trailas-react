import { useEffect } from "react";
import { Button, Card, Col, Form, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import FormControl from "../../formControl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormControl } from "../../../context/formControl";
import { Dayjs } from "dayjs";

const Filters = <T extends {}>() => {
  const { inputs, onPopupScroll, onSearchSelect, open } = useFormControl<T>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;

    let defaultValues: T = {} as T;

    inputs.forEach(item => {
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
  }, [form, inputs, searchParams, open]);

  const search = (values: T) => {
    let url = "";
    values = { ...values, pagina: 1, limite: 10 };

    const valueEntries = Object.entries(values);

    for (let i = 0; i < valueEntries.length; i++) {
      const [key, value] = valueEntries[i];

      if (!value) continue;

      if (i === 0) {
        url += `?${key}=${value}`;
        continue;
      }

      if (key === "createdAtRange") {
        const [startDate, endDate] = value as [Dayjs, Dayjs];

        url += `&startCreatedAt=${startDate.toISOString()}&endCreatedAt=${endDate.toISOString()}`;
        continue;
      }

      url += `&${key}=${value}`;
    }

    navigate({
      search: url
    });
  };

  return (
    <Card
      styles={{
        body: {
        }
      }}
    >
      <Form<T>
        layout="vertical"
        onFinish={(values) => search(values)}
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
        <Row style={{ marginBottom: -20 }} gutter={10}>
          {
            inputs.map((input) => {
              const { name, md } = input;
              const nameString = name as string;

              return (
                <Col key={nameString} xs={24} md={md || 8}>
                  <FormControl
                    input={input}
                    onPopupScroll={onPopupScroll}
                    onSearchSelect={onSearchSelect}
                  />
                </Col>
              );
            })
          }
        </Row>
      </Form>
    </Card >
  );
};

export default Filters;