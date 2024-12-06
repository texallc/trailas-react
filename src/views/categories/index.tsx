import HeaderView from "../../components/headerView";
import ServerTable from "../../components/tableServer";
import { Category } from "../../interfaces/models/category";
import FormControlProvider from "../../context/formControl";
import ModalForm from "../../components/modalForm";
import CachedImage from "../../components/cachedImage";
import { ruleName } from "../../constants";
import dayjs from "dayjs";

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
            </div>
          }
        ]}
        showDisabled
        showEdit
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
            rules: [ruleName],
            md: 24
          },
          {
            name: "description",
            label: "Descripción",
            type: "textarea",
            md: 24
          },
          {
            name: "image",
            label: "Imagen",
            type: "image",
            md: 24
          }
        ]}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  );
};

export default Categories;