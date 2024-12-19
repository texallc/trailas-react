import dayjs from "dayjs";
import CachedImage from "../../components/cachedImage";
import ServerTable from "../../components/tableServer";
import { User } from "../../interfaces/models/user";
import ModalForm from "../../components/modalForm";
import HeaderView from "../../components/headerView";
import FormControlProvider from "../../context/formControl";
import { ruleName } from "../../constants";

const Users = () => {
  return (
    <>
      <HeaderView />
      <ServerTable<User>
        filters={[
          {
            label: "Nombre",
            name: "name",
            md: 6
          },
          {
            label: "Email",
            name: "email",
            md: 6
          },
          {
            label: "Rol",
            name: "role",
            md: 6,
            type: "select",
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
            ]
          },
          {
            label: "Teléfono",
            name: "phone",
            md: 6
          }
        ]}
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
            render: (_, { createdAt }) => dayjs(createdAt).format("DD/MM/YYYY hh:mm:ss a"),
          },
          {
            title: "Fecha de actualización",
            key: "updatedAt",
            render: (_, { updatedAt }) => dayjs(updatedAt).format("DD/MM/YYYY hh:mm:ss a"),
          },
          {
            title: 'Imagen',
            key: 'image',
            render: (_, { image }) => <div style={{ display: "flex" }}>
              <CachedImage style={{ height: 70, width: 80, objectFit: "cover" }} imageUrl={image} />
            </div>,
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
            rules: [ruleName]
          },
          {
            name: "email",
            label: "Email",
            type: "email",
          },
          {
            name: "password",
            label: "Contraseña",
            type: "password",
          },
          {
            name: "confirmPassword",
            label: "Confirmar contraseña",
            type: "password",
          },
          {
            name: "role",
            label: "Rol",
            type: "select",
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
            rules: [
              {
                required: true,
                message: "Favor de seleccionar un rol."
              }
            ]
          },
          {
            name: "phone",
            label: "Teléfono",
            type: "phone"
          },
          {
            name: "description",
            label: "Descripción",
            type: "textarea",
            md: 24,
          },
          {
            name: "image",
            label: "Imagen",
            type: "image",
            md: 24,
          }
        ]}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  );
};

export default Users;