import { Inventory } from "../../interfaces/models/inventory";
import dayjs from "dayjs";
import ServerTable from "../../components/tableServer";

const Table = () => {
  return (
    <ServerTable<Inventory>
      columns={[
        {
          title: "Sucursal del producto",
          dataIndex: "user.name",
          render: (_, { user }) => user?.name,

        },
        {
          title: "Producto",
          dataIndex: "product",
          render: (_, { product }) => <div>
            <div><b>Nombre:</b> {product?.name}</div>
            <div><b>No. parte:</b> {product?.partNumber}</div>
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
    />
  );
};

export default Table;