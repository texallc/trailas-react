import { Modal } from "antd";
import HeaderView from "../../components/headerView";
import ServerTable from "../../components/tableServer"
import { Category } from "../../interfaces/models/category"
import ModalForm from "../../components/modalForm";

const Categories = () => {
  return (
    <>
      <HeaderView />
      <ServerTable<Category>
        columns={[
          {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Descripción",
            dataIndex: "description",
            key: "description",
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
            render: (_, { image }) => <img style={{ height: 64, width: 80, objectFit: "cover" }} alt="category-image" src={image} />,
          }
        ]}
        showDisabled
      />
      <ModalForm />
    </>
  );
};

export default Categories;