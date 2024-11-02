import ServerTable from "../../components/tableServer"
import { Sale } from "../../interfaces/models/sale"

const Sales = () => {
  return (
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
  )
}

export default Sales;