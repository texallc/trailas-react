import dayjs from "dayjs";
import HeaderView from "../../components/headerView";
import ModalForm from "../../components/modalForm";
import ServerTable from "../../components/tableServer"
import FormControlProvider from "../../context/formControl";
import { Inventory } from "../../interfaces/models/inventory";
import { useSearchParams } from "react-router-dom";
import { InputType } from "../../types/components/formControl";
import { useMemo } from "react";

const Inventories = () => {
  const [searchParams] = useSearchParams();

  const inputs = useMemo(() => {
    const id = searchParams.get("id");
    const inputs: InputType<Inventory>[] = [
      {
        name: "id",
        style: { display: "none" },
      },
      {
        name: "stock",
        label: "Stock",
      },
      {
        name: "userId",
        label: "Sucursal",
        type: "select",
        url: "/inventarios/list?pagina=1&limite=10",
      }
    ]
    return inputs;
  }, [searchParams]);

  return (
    <>
      <HeaderView
        showButton={false}
      />
      <ServerTable<Inventory>
        columns={[
          {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
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
        ]}
      />
      <FormControlProvider<Inventory>
        inputsProp={inputs}
      >
        <ModalForm />
      </FormControlProvider>
    </>
  );
};

export default Inventories;