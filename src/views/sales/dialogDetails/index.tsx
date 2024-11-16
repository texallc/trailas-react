import { Table } from "antd";
import Modal from "../../../components/modal";
import { SalesDetail } from "../../../interfaces/models/saleDetails";
import { ColumnsType } from "antd/es/table";
import { priceFormatUSD } from "../../../utils/functions";
import Big from "big.js";

interface DialogDetailsProps {
  open: boolean;
  onClose: () => void;
  details: SalesDetail[];
}

const columns: ColumnsType<SalesDetail> = [
  {
    title: "Producto",
    dataIndex: "product",
    render: (_, { product }) => <div>
      <div>Nombre: {product?.name}</div>
      <div>No. parte: {product?.partNumber}</div>
    </div>
  },
  {
    title: "Cantidad",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Precio",
    dataIndex: "price",
    key: "price",
    render: (_, { product }) => priceFormatUSD(product.price),
  },
  {
    title: "Subtotal por producto",
    dataIndex: "subtotal",
    key: "subtotal",
    render: (_, { product, quantity }) => priceFormatUSD(Big(product.price || 0).mul(quantity).toNumber()),
  }
];

const DialogDetails = ({ open, onClose, details }: DialogDetailsProps) => {
  return (
    <Modal
      width={800}
      open={open}
      onClose={onClose}
      onCancel={onClose}
      title="Detalles de venta"
      cancelText="Cerrar"
      okButtonProps={{
        style: {
          display: "none",
        }
      }}
    >
      <Table
        style={{
          width: "100%",
        }}
        scroll={{ x: 700 }}
        rowKey="id"
        columns={columns}
        dataSource={details}
        pagination={false}
      />
    </Modal>
  );
};

export default DialogDetails;