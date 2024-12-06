import { Product } from "../../interfaces/models/product";
import ServerTable from "../../components/tableServer";
import CachedImage from "../../components/cachedImage";
import { priceFormatUSD } from "../../utils/functions";
import dayjs from "dayjs";

const Table = () => {
  return (
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
            <CachedImage style={{ height: 70, width: 80, objectFit: "cover" }} imageUrl={image} />
          </div>,
        }
      ]}
      showDisabled
      showEdit
    />
  );
};

export default Table;