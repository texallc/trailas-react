import dayjs from "dayjs";
import HeaderView from "../../components/headerView";
import ModalForm from "../../components/modalForm";
import ServerTable from "../../components/tableServer";
import FormControlProvider from "../../context/formControl";
import { Sale } from "../../interfaces/models/sale";

const Sales = () => {
  return (
    <>
      <HeaderView
        showButton={false}
      />
      <ServerTable<Sale>
        columns={[
          {
            title: "Total",
            dataIndex: "total",
            key: "total",
          },
          {
            title: "Subtotal",
            dataIndex: "subtotal",
            key: "subtotal",
          },
          {
            title: "Impuesto de venta",
            dataIndex: "saleTax",
            key: "saleTax",
          },
          {
            title: "Estado",
            dataIndex: "status",
            key: "status",
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
      <FormControlProvider<Sale>
        inputsProp={[
          {
            name: "id",
            style: { display: "none" },
          },
          {
            name: "total",
            label: "Total",
            type: "number",
          },
          {
            name: "subtotal",
            label: "Subtotal",
            type: "number",
          },
          {
            name: "saleTax",
            label: "Impuesto de venta",
            type: "number",
          },
          {
            name: "status",
            label: "Estado",
          },
        ]}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  );
};

export default Sales;