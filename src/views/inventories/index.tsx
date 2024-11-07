import dayjs from "dayjs";
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
            render: (_, { createdAt }) => dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss a"),
          },
          {
            title: "Fecha de actualización",
            key: "updatedAt",
            render: (_, { updatedAt }) => dayjs(updatedAt).format("DD/MM/YYYY HH:mm:ss a"),
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