import { Product } from "../../interfaces/models/product";
import HeaderView from "../../components/headerView";
import ServerTable from "../../components/tableServer";
import CachedImage from "../../components/cachedImage";
import ModalForm from "../../components/modalForm";
import { priceFormatUSD } from "../../utils/functions";
import dayjs from "dayjs";
import { useFormControl } from "../../context/formControl";
import { useEffect } from "react";
import { Get } from "../../interfaces";
import { useGetContext } from "../../context/getContext";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const { response } = useGetContext<Get<Product>>();
  const { form, inputs } = useFormControl<Product>();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    const data = response?.list.find(p => p.id === +id);

    form?.setFieldValue("userIds", data?.inventories?.map(i => i.userId));
  }, [id, form, response, inputs]);

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
            title: "Categoria",
            dataIndex: "category.name",
            render: (_, { category }) => category?.name,
          },
          {
            title: "Número de parte",
            dataIndex: "partNumber",
            key: "partNumber",
          },
          {
            title: "Precio",
            dataIndex: "price",
            render: (_, { price }) => priceFormatUSD(price)
          },
          {
            title: "Marca",
            dataIndex: "brand",
            key: "brand",
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
            title: "Imagen",
            key: "image",
            render: (_, { image }) => <div style={{ display: "flex" }}>
              <CachedImage style={{ height: 64, width: 80, objectFit: "cover" }} imageUrl={image} />
            </div>,
          }
        ]}
        showDisabled
        showEdit
      />
      <ModalForm />
    </>
  );
};

export default Products;