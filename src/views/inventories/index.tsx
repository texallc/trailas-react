import HeaderView from "../../components/headerView";
import ModalForm from "../../components/modalForm";
import ServerTable from "../../components/tableServer";
import { Inventory } from "../../interfaces/models/inventory";

const Inventories = () => {
  return (
    <>
      <HeaderView />
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
      <ModalForm />
    </>
  );
};

export default Inventories;