import dayjs from "dayjs";
import HeaderView from "../../components/headerView";
import ModalForm from "../../components/modalForm";
import ServerTable from "../../components/tableServer";
import FormControlProvider from "../../context/formControl";
import { Inventory } from "../../interfaces/models/inventory";
import { useMemo } from "react";
import { InputType } from "../../types/components/formControl";
import { useGetContext } from "../../context/getContext";
import { Get } from "../../interfaces";
import { DefaultOptionType } from "antd/es/select";
import { useSearchParams } from "react-router-dom";

const Inventories = () => {
  const { response, loading } = useGetContext<Get<Inventory>>();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const inputs = useMemo(() => {
    if (!response || loading || !id) return [];

    const { list: inventories } = response;
    const { user, product, stock } = inventories.find(i => i.id === +id)!;
    const minStock = stock;

    const optionsUserId: DefaultOptionType[] = [{
      value: user?.id,
      label: user?.name
    }];

    const optionsProductId: DefaultOptionType[] = [{
      value: product?.id,
      label: `${product?.name} - No. parte: ${product?.partNumber}`
    }];

    const inputs: InputType<Inventory>[] = [
      {
        name: "id",
        style: { display: "none" },
      },
      {
        name: "userId",
        label: "Sucursal",
        type: "select",
        options: optionsUserId,
        disabled: true
      },
      {
        name: "productId",
        label: "Producto",
        type: "select",
        options: optionsProductId,
        disabled: true
      },
      {
        name: "stock",
        label: "Stock",
        type: "number",
        disabled: true
      },
      {
        name: "addStock",
        label: "Agregar o quitar stock",
        type: "number",
        min: -minStock,
      }
    ];

    return inputs;
  }, [response, loading, id]);

  return (
    <>
      <HeaderView
        showButton={false}
      />
      <ServerTable<Inventory>
        filters={[
          {
            label: "Sucursal del producto",
            name: "userId",
            md: 6,
            type: "select",
            url: "/usuarios/list?pagina=1&limite=10&role=Administrador de Sucursal",
          },
          {
            label: "Nombre del producto",
            name: "productName",
            md: 6
          },
          {
            label: "Número de parte del producto",
            name: "productPartNumber",
            md: 6
          },
          {
            label: "Descripción del producto",
            name: "productDescription",
            md: 6
          }
        ]}
        columns={[
          {
            title: "Sucursal del producto",
            dataIndex: "user.name",
            render: (_, { user }) => <div>
              <div><b>Nombre:</b> {user?.name}</div>
              <div><b>Email:</b> {user?.email}</div>
            </div>,
          },
          {
            title: "Producto",
            dataIndex: "product",
            render: (_, { product }) => <div>
              <div><b>Nombre:</b> {product?.name}</div>
              <div><b>No. parte:</b> {product?.partNumber}</div>
              <div><b>Descripción:</b> {product?.description || "Sin descripción"}</div>
            </div>
          },
          {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
          },
          {
            title: "Fecha de creación",
            dataIndex: "createdAt",
            render: (_, { createdAt }) => dayjs(createdAt).format("DD/MM/YYYY hh:mm:ss a"),
          },
          {
            title: "Fecha de actualización",
            key: "updatedAt",
            render: (_, { updatedAt }) => dayjs(updatedAt).format("DD/MM/YYYY hh:mm:ss a"),
          }
        ]}
        showEdit
        showDisabled
      />
      <FormControlProvider<Inventory>
        inputsProp={inputs}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  );
};

export default Inventories;