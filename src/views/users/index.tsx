import dayjs from "dayjs";
import CachedImage from "../../components/cachedImage";
import ServerTable from "../../components/tableServer";
import { User } from "../../interfaces/models/user";
import ModalForm from "../../components/modalForm";
import HeaderView from "../../components/headerView";
import FormControlProvider from "../../context/formControl";

const Users = () => {
  return (
    <>
      <HeaderView />
      <ServerTable<User>
        columns={[
          {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Rol",
            dataIndex: "role",
            key: "role",
          },
          {
            title: "Teléfono",
            dataIndex: "phone",
            key: "phone",
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
          {
            title: 'Imagen',
            key: 'image',
            render: (_, { image }) => <CachedImage style={{ height: 64, width: 80, objectFit: "cover" }} imageUrl={image} />,
          }
        ]}
        showDisabled
        showEdit
      />
      <FormControlProvider<User>
        inputsProp={[
          {
            name: "id",
            style: { display: "none" },
          },
          {
            name: "uid",
            style: { display: "none" },
          },
          {
            name: "name",
            label: "Nombre",
            required: true,
          },
          {
            name: "email",
            label: "Email",
            required: true,
          },
          {
            name: "role",
            label: "Rol",
            type: "select",
            required: true,
            options: [
              {
                value: "Super Admin",
                label: "Super Admin"
              },
              {
                value: "Administrador de Sucursal",
                label: "Administrador de Sucursal"
              },
              {
                value: "Vendedor",
                label: "Vendedor"
              },
              {
                value: "Comprador",
                label: "Comprador"
              }
            ],
          },
          {
            name: "phone",
            label: "Teléfono",
          },
        ]}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  );
};

export default Users;