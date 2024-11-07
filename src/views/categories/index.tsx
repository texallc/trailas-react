import HeaderView from "../../components/headerView";
import ServerTable from "../../components/tableServer"
import { Category } from "../../interfaces/models/category"
import FormControlProvider from "../../context/formControl";
import { Modal } from "antd";
import ModalForm from "../../components/modalForm";
import CachedImage from "../../components/cachedImage";
import { ruleMaxLength, ruleName } from "../../constants";

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
            render: (_, { image }) => <CachedImage style={{ height: 64, width: 80, objectFit: "cover" }} imageUrl={image} />,
          }
        ]}
        showDisabled
      />
      <FormControlProvider<Category>
        inputsProp={[
          {
            name: "id",
            style: { display: "none" },
          },
          {
            name: "name",
            label: "Nombre",
            required: true,
            rules: [ruleName, ruleMaxLength]
          },
          {
            name: "description",
            label: "Descripción",
            type: "textarea",
          }
        ]}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  );
};

export default Categories;