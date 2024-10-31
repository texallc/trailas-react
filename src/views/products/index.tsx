import ServerTable from "../../components/tableServer"
import { Product } from "../../interfaces/models/product"

const Products = () => {
  return (
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
          key: "createdAt",
        },
        {
          title: "Fecha de actualización",
          dataIndex: "updatedAt",
          key: "updatedAt",
        },
        {
          title: "Imagen",
          key: "image",
          render: (_, { image }) => <img style={{ height: 64, width: 80, objectFit: "cover" }} alt="product-image" src={image} />,
        }
      ]}
    />
  );
};

export default Products;