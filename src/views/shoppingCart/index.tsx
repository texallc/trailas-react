import { useEffect, useMemo, useState } from "react";
import HeaderView from "../../components/headerView";
import { useAuth } from "../../context/authContext";
import { Inventory } from "../../interfaces/models/inventory";
import FormControlProvider from "../../context/formControl";
import BranchOfficeFilter from "./branchOfficeFilter";
import ServerTable from "../../components/tableServer";
import { useGetContext } from "../../context/getContext";
import { Get } from "../../interfaces";
import { User } from "../../interfaces/models/user";
import { Button, Card, Col, Empty, Form, Input, InputNumber, message, Row, Table } from "antd";
import { RetweetOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { confirmDialog, priceFormatUSD } from "../../utils/functions";
import Big from 'big.js';
import { useNavigate } from "react-router-dom";
import { columnsProductsCart } from "../../constants";
import FormItem from "antd/es/form/FormItem";
import { ProductCart } from "../../types/models/sale";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<ProductCart>();
  const { user } = useAuth();
  const { response, loading } = useGetContext<Get<Inventory>>();
  const [showSelectBranchOffice, setShowSelectBranchOffice] = useState(false);
  const [userId, setUserId] = useState<number>(0);
  const [branchOffice, setBranchOffice] = useState<User | null>(null);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [productsCart, setProductsCart] = useState<ProductCart[]>([]);
  const [taxes, setTaxes] = useState<number | undefined | null>(0);
  const valuesForm = Form.useWatch([], form);

  useEffect(() => {
    if (user?.role !== "Super Admin") return;

    setShowSelectBranchOffice(true);
  }, [user]);

  useEffect(() => {
    if (loading || !response?.list.length) return;

    setInventories(response?.list);
    setBranchOffice(response?.list[0].user!);
  }, [response]);

  const getTotal = useMemo(() => {
    if (!productsCart.length || !Object.keys(valuesForm).length) return 0;

    Object.entries(valuesForm).forEach(([key, value]) => {
      console.log(key);
      if (key.includes("quantity-")) {
        const productId = Number(key.split("-")[1]);
        const inventory = inventories.find((inventory) => inventory.productId === productId);
        const quantity = Number(value);
        const price = inventory?.product?.price || 0;
        const subTotal = Big(price).mul(quantity).toNumber();

        console.log(subTotal);
      }
    });
    console.log(valuesForm);
  }, [valuesForm, productsCart]);

  console.log(getTotal);

  const SubTotalCell = ({ productId }: { productId: number; }) => {
    const quantity = Form.useWatch(`quantity-${productId}`, form) || 0;
    const price = inventories.find((inventory) => inventory.productId === productId)?.product?.price || 0;

    return <div>
      {priceFormatUSD(Big(price).mul(quantity).toNumber())}
    </div>;
  };

  const onSaveSale = (products: ProductCart) => {
    console.log(products);
  };

  return (
    <div>
      <HeaderView
        showButton={false}
      />
      {
        user?.role === "Super Admin" && showSelectBranchOffice &&
        <FormControlProvider<Inventory>
          inputsProp={[
            {
              name: "id",
              type: "select",
              label: "Sucursal",
              url: "/usuarios/list?pagina=1&limite=10&role=Administrador de Sucursal",
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione una sucursal para la venta."
                }
              ]
            }
          ]}
        >
          <BranchOfficeFilter
            onSelectBranchOffice={(value) => {
              setUserId(value);
              setShowSelectBranchOffice(false);
              setProductsCart([]);
              setTaxes(0);
              form.resetFields();
              navigate({ search: `?pagina=1&limite=5&userId=${value}` });
            }}
          />
        </FormControlProvider>
      }
      {
        !showSelectBranchOffice && <div>
          <Row align="middle" gutter={20}>
            <Col>
              <h3>Lista de productos {` | Sucursal: ${branchOffice?.name}`}</h3>
            </Col>
            {
              user?.role === "Super Admin" && !showSelectBranchOffice && <Row
                justify='end'
              >
                <Col>
                  <Button
                    icon={<RetweetOutlined />}
                    type="default"
                    onClick={async () => {
                      await confirmDialog(
                        "¿Seguro que deseas cambiar de sucursal?",
                        async () => {
                          setUserId(0);
                          setShowSelectBranchOffice(true);
                        }
                      );
                    }}
                  >
                    Cambiar de sucursal
                  </Button>
                </Col>
              </Row>
            }
          </Row>
          <hr />
          <ServerTable<Inventory>
            url={userId ? `/inventarios/list-by-branch-office?pagina=1&limite=5&userId=${userId}` : ""}
            columns={[
              ...columnsProductsCart,
              {
                title: "Agregar al carrito",
                key: "add",
                fixed: "right",
                width: 100,
                render: (_, inventory: Inventory) => (
                  <Button
                    shape="circle"
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => {
                      const productCart: ProductCart = { ...inventory };

                      setProductsCart([...productsCart, productCart]);
                    }}
                    disabled={!inventory.stock || productsCart.some((product) => product.productId === inventory.productId)}
                    title={inventory.stock ? "" : "Sin stock"}
                  />
                )
              }
            ]}
          />
          <hr />
          <br />
          <Form<ProductCart>
            onFinish={onSaveSale}
            form={form}
          >
            <h3>Productos seleccionados</h3>
            <Row align='top' gutter={10}>
              <Col xs={24} md={20}>
                <Table
                  rowKey="id"
                  columns={[
                    ...columnsProductsCart,
                    {
                      title: "Cantidad",
                      dataIndex: "quantity",
                      render: (_, { id, productId }) => (
                        <div style={{ marginBottom: -22 }}>
                          <FormItem
                            name={`quantity-${productId}`}
                            rules={[
                              {
                                required: true,
                                message: "Por favor elija una cantidad."
                              }
                            ]}
                          >
                            <InputNumber
                              min={1}
                              max={inventories.find(i => i.id === id)?.stock}
                              disabled={!inventories.find(i => i.id === id)?.stock}
                            />
                          </FormItem>
                        </div>
                      )
                    },
                    {
                      title: "Subtotal",
                      dataIndex: "subTotal",
                      render: (_, { productId }) => <SubTotalCell
                        productId={productId}
                      />
                    },
                    {
                      title: "Eliminar del carrito",
                      key: "add",
                      fixed: "right",
                      width: 100,
                      render: (_, inventory: Inventory) => (
                        <Button
                          shape="circle"
                          icon={<DeleteOutlined />}
                          type="primary"
                          onClick={async () => {
                            await confirmDialog(
                              "¿Seguro que deseas eliminar este producto del carrito?",
                              async () => {
                                form.setFieldValue(`quantity-${inventory.productId}`, 0);
                                setProductsCart(productsCart.filter((product) => product.productId !== inventory.productId));
                              }
                            );
                          }}
                        />
                      )
                    }
                  ]}
                  dataSource={productsCart}
                  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Sin productos en el carrito.' /> }}
                  pagination={false}
                />
              </Col>
              <Col xs={24} md={4}>
                <Card>
                  <h4>Detalle de venta</h4>
                  <hr />
                  <div style={{ display: "grid" }}>
                    <label>Impuestos:</label>
                    <InputNumber
                      value={taxes}
                      onChange={(e) => setTaxes(e)}
                      prefix="%"
                      min={0}
                      max={100}
                    />
                  </div>
                  <br />
                  <div>Sub total: {priceFormatUSD(0)}</div>
                  <div>Total: {priceFormatUSD(0)}</div>
                </Card>
              </Col>
            </Row>
            <br />
            <Row justify="end">
              <Button type="primary" htmlType="submit">Terminar compra</Button>
            </Row>
          </Form>
        </div>
      }
    </div>
  );
};

export default ShoppingCart;