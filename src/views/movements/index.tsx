import dayjs from "dayjs"
import HeaderView from "../../components/headerView"
import ServerTable from "../../components/tableServer"
import { Movement } from "../../interfaces/models/movement"
import ModalForm from "../../components/modalForm"
import FormControlProvider from "../../context/formControl"

const Movements = () => {
  return (
    <>
      <HeaderView
        showButton={false}
      />
      <ServerTable<Movement>
        columns={[
          {
            title: "Cantidad",
            dataIndex: "quantity",
            key: "quantity",
          },
          {
            title: "Inventario",
            dataIndex: "inventoryId",
            key: "inventoryId",
          },
          {
            title: "Usuario",
            dataIndex: "userId",
            key: "userId",
          },
          {
            title: "Tipo de movimiento",
            dataIndex: "typeMovement",
            key: "typeMovement",
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
        showEdit
      />
      <FormControlProvider<Movement>
        inputsProp={[
          {
            name: "id",
            style: { display: "none" },
          },
          {
            name: "quantity",
            label: "Cantidad",
            type: "number",
          },
          {
            name: "inventoryId",
            label: "Inventario",
          },
          {
            name: "userId",
            label: "Usuario",
          },
          {
            name: "typeMovement",
            label: "Tipo de movimiento",
          }
        ]}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  )
}

export default Movements