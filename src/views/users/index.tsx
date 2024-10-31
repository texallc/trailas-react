import ServerTable from "../../components/tableServer";
import { User } from "../../interfaces/models/user";

const Users = () => {
  return (
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
          key: "createdAt",
        },
        {
          title: "Fecha de actualización",
          dataIndex: "updatedAt",
          key: "updatedAt",
        },
        {
          title: 'Imagen',
          key: 'image',
          render: () => <img alt="user-image" />,
        },
      ]}
    />
  );
};

export default Users;