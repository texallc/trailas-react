import FormControl from "../../components/formControl";
import HeaderView from "../../components/headerView";
import ModalForm from "../../components/modalForm";
import ServerTable from "../../components/tableServer"
import FormControlProvider from "../../context/formControl";
import { Sale } from "../../interfaces/models/sale"

const Sales = () => {
  return (
    <>
      <HeaderView />
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
            key: "createdAt",
          },
          {
            title: "Fecha de actualización",
            dataIndex: "updatedAt",
            key: "updatedAt",
          }
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
          },
          {
            name: "subtotal",
            label: "Subtotal",
          },
          {
            name: "saleTax",
            label: "Impuesto de venta",
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
  )
}

export default Sales;