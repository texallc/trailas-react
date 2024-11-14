import dayjs from "dayjs";
import HeaderView from "../../components/headerView";
import ModalForm from "../../components/modalForm";
import ServerTable from "../../components/tableServer";
import FormControlProvider from "../../context/formControl";
import { Inventory } from "../../interfaces/models/inventory";
import { render } from "react-dom";

const Inventories = () => {
  return (
    <>
      <HeaderView
        showButton={false}
      />
      <ServerTable<Inventory>
        columns={[
          {
            title: "Sucursal",
            dataIndex: "user.name",
            render: (_, { user }) => user?.name,

          },
          {
            title: "Producto",
            dataIndex: "product.name",
            render: (_, { product }) => product?.name,
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
          },
        ]}
      />
      <FormControlProvider<Inventory>
        inputsProp={[
          {
            name: "id",
            style: { display: "none" },
          },
          {
            name: "stock",
            label: "Stock",
          },
          {
            name: "userId",
            label: "Sucursal",
            type: "select",
            url: "/inventarios/list?pagina=1&limite=10",
          }
        ]}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  );
};

export default Inventories;