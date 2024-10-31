import ServerTable from "../../components/tableServer"
import { Inventory } from "../../interfaces/models/inventory";

const Inventories = () => {
  return (
    <ServerTable<Inventory>
      columns={[
        {
          title: "Stock",
          dataIndex: "stock",
          key: "stock",
        },
        {
          title: "Fecha de creación",
          dataIndex: "createdAt",
          key: "createdAt",
        },
        {
          title: "Fecha de actualización",
          dataIndex: "updatedAt",
          key: "updatedAt",
        },
      ]}
    />
  );
};

export default Inventories;