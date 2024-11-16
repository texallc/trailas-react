import dayjs from "dayjs";
import HeaderView from "../../components/headerView";
import ServerTable from "../../components/tableServer";
import { Movement } from "../../interfaces/models/movement";
import ModalForm from "../../components/modalForm";
import FormControlProvider from "../../context/formControl";

const Movements = () => {
  return (
    <>
      <HeaderView
        showButton={false}
      />
      <ServerTable<Movement>
        columns={[
          {
            title: "Producto",
            dataIndex: "inventory.product.name",
            render: (_, { inventory }) => <div>
              <div>Nombre: {inventory?.product?.name}</div>
              <div>No. parte: {inventory?.product?.partNumber}</div>
            </div>
          },
          {
            title: "Tipo de movimiento",
            dataIndex: "typeMovement",
            key: "typeMovement",
          },
          {
            title: "Cantidad",
            dataIndex: "quantity",
            key: "quantity",
          },
          {
            title: "Sucursal",
            dataIndex: "inventory.user.name",
            render: (_, { inventory }) => <div>
              <div>{inventory?.user?.name}</div>
              <div>{inventory?.user?.email}</div>
            </div>
          },
          {
            title: "Usuario del movimiento",
            dataIndex: "user.name",
            render: (_, { user }) => <div>
              <div>{user?.name}</div>
              <div>{user?.email}</div>
            </div>,
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
  );
};

export default Movements;