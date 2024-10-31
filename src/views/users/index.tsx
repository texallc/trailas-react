import ServerTable from "../../components/tableServer";

const Users = () => {
  return (
    <ServerTable
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
      ]}
    />
  );
};

export default Users;