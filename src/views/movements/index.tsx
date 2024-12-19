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
        filters={[
          {
            label: "Nombre del producto",
            name: "productName",
            md: 6
          },
          {
            label: "Número de parte del producto",
            name: "productPartNumber",
            md: 6
          },
          {
            label: "Descripción del producto",
            name: "productDescription",
            md: 6
          },
          {
            label: "Tipo de movimiento",
            name: "typeMovement",
            md: 6,
            type: "select",
            options: [
              {
                label: "Entrada",
                value: "Entrada"
              },
              {
                label: "Salida",
                value: "Salida"
              }
            ]
          },
          {
            label: "Sucursal del producto",
            name: "branchOfficeId",
            md: 6,
            type: "select",
            url: "/usuarios/list?pagina=1&limite=10&role=Administrador de Sucursal",
          },
          {
            label: "Usuario del movimiento",
            name: "userId",
            md: 6,
            type: "select",
            url: "/usuarios/list-admins?pagina=1&limite=100",
          },
          {
            label: "Fecha de creación",
            name: "createdAtRange",
            md: 6,
            type: "date",
            showTime: true
          },
        ]}
        columns={[
          {
            title: "Producto",
            dataIndex: "inventory.product.name",
            render: (_, { inventory }) => <div>
              <div><b>Nombre:</b> {inventory?.product?.name}</div>
              <div><b>No. parte:</b> {inventory?.product?.partNumber}</div>
              <div><b>Descripción:</b> {inventory?.product?.description || "Sin descripción"}</div>
            </div>
          },
          {
            title: "Tipo de movimiento",
            dataIndex: "typeMovement",
            key: "typeMovement",
            width: 64
          },
          {
            title: "Cantidad",
            dataIndex: "quantity",
            key: "quantity",
            width: 40
          },
          {
            title: "Sucursal del producto",
            dataIndex: "inventory.user.name",
            render: (_, { inventory }) => <div>
              <div><b>Nombre:</b> {inventory?.user?.name}</div>
              <div><b>Email:</b> {inventory?.user?.email}</div>
            </div>
          },
          {
            title: "Usuario del movimiento",
            dataIndex: "user.name",
            render: (_, { user }) => <div>
              <div><b>Nombre:</b> {user?.name}</div>
              <div><b>Email:</b> {user?.email}</div>
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