import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/authContext";
import { Inventory } from "../../interfaces/models/inventory";
import FormControlProvider from "../../context/formControl";
import BranchOfficeFilter from "./branchOfficeFilter";
import ServerTable from "../../components/tableServer";
import { useGetContext } from "../../context/getContext";
import { Get } from "../../interfaces";
import { User } from "../../interfaces/models/user";
import { Button, Card, Col, Empty, Form, InputNumber, message, Row, Table } from "antd";
import { RetweetOutlined, PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { confirmDialog, priceFormatUSD } from "../../utils/functions";
import Big from 'big.js';
import { useNavigate, useSearchParams } from "react-router-dom";
import { columnsProductsCart } from "../../constants";
import FormItem from "antd/es/form/FormItem";
import { ProductCart } from "../../types/models/product";
import { Cart, ProductInCart } from "../../interfaces/cart";
import { post } from "../../services/http";
import useAbortController from "../../hooks/useAbortController";

const ShoppingCart = () => {
  const abortController = useAbortController();
  const [searchParams] = useSearchParams();
  const userId = Number(searchParams.get("userId") || 0);
  const navigate = useNavigate();
  const [form] = Form.useForm<ProductCart>();
  const valuesForm = Form.useWatch([], form);
  const { user } = useAuth();
  const { response, loading } = useGetContext<Get<Inventory>>();
  const [showSelectBranchOffice, setShowSelectBranchOffice] = useState(false);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [productsCart, setProductsCart] = useState<ProductCart[]>([]);
  const [taxes, setTaxes] = useState<number | undefined | null>(0);
  const [discount, setDiscount] = useState<number | undefined | null>(0);
  const [saving, setSaving] = useState(false);
  const [branchOfficeName, setBranchOfficeName] = useState<string>("");

  useEffect(() => {
    if (user?.role !== "Super Admin") return;

    setShowSelectBranchOffice(true);
  }, [user]);

  useEffect(() => {
    if (loading || !response?.list.length) return;

    setInventories(response?.list);
  }, [response]);

  const subtotal = useMemo(() => {
    if (!productsCart.length || !Object.keys(valuesForm).length) return 0;

    const entriesForm = Object.entries(valuesForm);

    const subtotal = entriesForm.reduce((acc, [key, value]) => {
      if (!key.includes("quantity-")) return acc;

      const productId = Number(key.split("-")[1]);
      const inventory = inventories.find((inventory) => inventory.productId === productId);
      const quantity = Number(value || 0);
      const price = Number(inventory?.product?.price || 0);
      const subtotalByProduct = Big(price).mul(quantity).plus(acc);

      return subtotalByProduct.toNumber();
    }, 0);

    return subtotal;
  }, [valuesForm, productsCart]);

  const { total, totalWithoutDiscount } = useMemo(() => {
    if (!subtotal) return {
      total: 0,
      totalWithoutDiscount: 0
    };

    const _taxes = taxes ? Big(Math.min(taxes, 100)) : Big(0);
    const _discount = discount ? Big(Math.min(discount, 100)) : Big(0);

    const totalWithoutDiscount = Big(subtotal)
      .mul(Big(1).plus(_taxes.div(100))); // Aplica el impuesto

    const total = totalWithoutDiscount.mul(Big(1).minus(_discount.div(100))); // Aplica el descuento

    return {
      totalWithoutDiscount: totalWithoutDiscount.toNumber(),
      total: total.toNumber()
    };
  }, [subtotal, taxes, discount]);

  const SubTotalCell = ({ productId }: { productId: number; }) => {
    const quantity = Form.useWatch(`quantity-${productId}`, form) || 0;
    const price = inventories.find((inventory) => inventory.productId === productId)?.product?.price || 0;

    return <div>
      {priceFormatUSD(Big(price).mul(quantity).toNumber())}
    </div>;
  };

  const clearCart = () => {
    setBranchOfficeName("");
    setProductsCart([]);
    setTaxes(0);
    setDiscount(0);
    form.resetFields();
  };

  const onSaveSale = async (productsCartForm: ProductCart) => {
    const products: ProductInCart[] = productsCart.map(p => {
      const quantity = Number(productsCartForm[`quantity-${p.productId}`] || 0);

      return {
        productId: p.productId,
        price: Number(p.product?.price || 0),
        quantity
      };
    });

    const cart: Cart = {
      total,
      subtotal,
      discount: discount || 0,
      taxes: taxes || 0,
      products
    };

    setSaving(true);

    try {
      await post("/ventas/create", cart, abortController.current);

      message.success("Venta guardada correctamente!");

      clearCart();
      setShowSelectBranchOffice(true);
    } catch (error) {
      console.log(error);
      message.error("Error al guardar la venta");
    } finally {
      setSaving(false);
    };
  };

  return (
    <div style={{ marginTop: 15 }}>
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
              clearCart();
              setShowSelectBranchOffice(false);
              setBranchOfficeName(value.title || "");
              navigate({ search: `?pagina=1&limite=5&userId=${value.value}` });
            }}
          />
        </FormControlProvider>
      }
      {
        !showSelectBranchOffice && <div>
          <Row align="middle" gutter={20}>
            <Col>
              <h3>Lista de productos {` | Sucursal: ${branchOfficeName}`}</h3>
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
                          clearCart();
                          setShowSelectBranchOffice(true);
                          navigate({ search: "" });
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
            wait={!Boolean(userId)}
            url={`/inventarios/list-by-branch-office?pagina=1&limite=5&userId=${userId}`}
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
                    title={productsCart.some((product) => product.productId === inventory.productId) ? "En el carrito" : inventory.stock ? "" : "Sin stock"}
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
            <h3>Productos en el carrito</h3>
            <Row align='top' gutter={10}>
              <Col xs={24} md={18}>
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
              <Col xs={24} md={6}>
                <Card>
                  <h4>Detalle de venta</h4>
                  <hr />
                  <div>Sub total: {priceFormatUSD(subtotal)}</div>
                  <br />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label>Impuesto: </label>
                    <div style={{ width: 10 }} />
                    <InputNumber
                      value={taxes}
                      onChange={(e) => setTaxes(e)}
                      prefix="%"
                      min={0}
                      max={100}
                      size="small"
                    />
                  </div>
                  <br />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label>Descuento: </label>
                    <div style={{ width: 10 }} />
                    <InputNumber
                      value={discount}
                      onChange={(e) => setDiscount(e)}
                      prefix="%"
                      min={0}
                      max={100}
                      size="small"
                    />
                  </div>
                  <br />
                  <div>Total sin descuento: {priceFormatUSD(totalWithoutDiscount)}</div>
                  <div>
                    <b>Total: {priceFormatUSD(total)}</b>
                  </div>
                  <br />
                  <Row justify="end">
                    <Button
                      icon={<ShoppingCartOutlined />}
                      type="primary"
                      htmlType="submit"
                      loading={saving}
                      disabled={saving || !productsCart.length}
                    >
                      Terminar compra
                    </Button>
                  </Row>
                </Card>
              </Col>
            </Row>
            <br />
          </Form>
        </div>
      }
    </div>
  );
};

export default ShoppingCart;