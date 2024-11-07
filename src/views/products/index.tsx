import dayjs from "dayjs";
import { Modal } from "antd";
import HeaderView from "../../components/headerView";
import ServerTable from "../../components/tableServer"
import { Product } from "../../interfaces/models/product"
import ModalForm from "../../components/modalForm";
import FormControlProvider from "../../context/formControl";
import CachedImage from "../../components/cachedImage";
import { ruleMaxLength, ruleName, rulePrice } from "../../constants";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { InputType } from "../../types/components/formControl";

const Products = () => {
  const [searchParams] = useSearchParams();

  const inputs = useMemo(() => {
    const id = searchParams.get("id");
    const inputs: InputType<Product>[] = [
      {
        name: "id",
        style: { display: "none" },
      },
      {
        name: "name",
        label: "Nombre",
        rules: [ruleName, ruleMaxLength]
      },
      {
        name: "partNumber",
        label: "Número de parte",
        required: true,
        rules: [ruleMaxLength]
      },
      {
        name: "price",
        label: "Precio",
        type: "number",
        rules: [rulePrice]
      },
      {
        name: "brand",
        label: "Marca",
        required: true,
        rules: [ruleMaxLength]
      },
      {
        name: "description",
        label: "Descripción",
        type: "textarea",
      },
      {
        name: "categoryId",
        label: "Categoría",
        type: "select",
        url: "/categorias/list?pagina=1&limite=10",
      }
    ]
    if (id && id !== "0") {
      inputs.push({
        name: "active",
        label: "Active",
        type: "switch",
      });
    }
    return inputs;
  }, [searchParams]);

  return (
    <>
      <HeaderView />
      <ServerTable<Product>
        columns={[
          {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Número de parte",
            dataIndex: "partNumber",
            key: "partNumber",
          },
          {
            title: "Precio",
            dataIndex: "price",
            key: "price",
          },
          {
            title: "Marca",
            dataIndex: "brand",
            key: "brand",
          },
          {
            title: "Descripción",
            dataIndex: "description",
            key: "description",
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
            title: "Imagen",
            key: "image",
            render: (_, { image }) => <CachedImage style={{ height: 64, width: 80, objectFit: "cover" }} imageUrl={image} />,
          }
        ]}
        showDisabled
        showEdit
      />
      <FormControlProvider<Product>
        inputsProp={inputs}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  );
};

export default Products;