import { useState } from "react";
import dayjs from "dayjs";
import HeaderView from "../../components/headerView";
import ModalForm from "../../components/modalForm";
import ServerTable from "../../components/tableServer";
import FormControlProvider from "../../context/formControl";
import { Sale } from "../../interfaces/models/sale";
import { priceFormatUSD } from "../../utils/functions";
import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import DialogDetails from "./dialogDetails";
import { SalesDetail } from "../../interfaces/models/saleDetails";

const Sales = () => {
  const [openDetails, setOpenDetails] = useState(false);
  const [details, setDetails] = useState<SalesDetail[]>([]);

  return (
    <>
      <HeaderView
        showButton={false}
      />
      <ServerTable<Sale>
        filters={[
          {
            label: "Vendedores",
            name: "sellerId",
            md: 6,
            type: "select",
            url: "/usuarios/list-sellers?pagina=1&limite=100",
          },
          {
            label: "Fecha de creación",
            name: "createdAtRange",
            md: 6,
            type: "date",
            showTime: true
          },
        ]}
        columns={[
          {
            title: "Vendedor",
            dataIndex: "seller",
            key: "seller",
            width: 200,
            render: (_, { seller }) => <div>
              <div><b>Nombre:</b> {seller?.name}</div>
              <div><b>Email:</b> {seller?.email}</div>
            </div>
          },
          {
            title: "Comprador",
            dataIndex: "buyer",
            key: "buyer",
            width: 200,
            render: (_, { buyer }) => <div>
              <div>{buyer?.name}</div>
              {buyer?.name !== "Sin comprador" && <div>{buyer?.email}</div>}
            </div>
          },
          {
            title: "Impuesto",
            dataIndex: "taxes",
            render: (_, { taxes }) => `% ${taxes}`
          },
          {
            title: "Descuento",
            dataIndex: "discount",
            render: (_, { discount }) => `% ${discount}`
          },
          {
            title: "Subtotal",
            dataIndex: "subtotal",
            render: (_, { subtotal }) => priceFormatUSD(subtotal)
          },
          {
            title: "Total",
            dataIndex: "total",
            render: (_, { total }) => priceFormatUSD(total)
          },
          {
            title: "Estatus",
            dataIndex: "status",
            key: "status",
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
            title: "Detalles de venta",
            key: "details",
            fixed: "right",
            render: (_, { details }) => (
              <Button
                type="primary"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => {
                  setDetails(details);
                  setOpenDetails(true);
                }}
              />
            ),
          }
        ]}
      />
      <FormControlProvider<Sale>
        inputsProp={[
          {
            name: "id",
            style: { display: "none" },
          },
          {
            name: "total",
            label: "Total",
            type: "number",
          },
          {
            name: "subtotal",
            label: "Subtotal",
            type: "number",
          },
          {
            name: "taxes",
            label: "Impuesto de venta",
            type: "number",
          },
          {
            name: "status",
            label: "Estado",
          },
        ]}
      >
        <ModalForm />
      </FormControlProvider>
      <DialogDetails
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        details={details}
      />
    </>
  );
};

export default Sales;