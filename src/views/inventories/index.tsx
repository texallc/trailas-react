import HeaderView from "../../components/headerView";
import ModalForm from "../../components/modalForm";
import ServerTable from "../../components/tableServer"
import FormControlProvider from "../../context/formControl";
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
        ]}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  );
};

export default Inventories;