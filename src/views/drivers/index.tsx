import { useEffect, useMemo, useState } from "react";
import { Button, Col, Input, Row } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import TableContext from "../../components/tableContext";
import { ColumnsType } from "antd/es/table";
import ModalCreateDriver from "./modalCreateDriver";
import { useOnSnapshotContext } from "../../context/snapshotContext";
import { endAt, orderBy, QueryConstraint, startAt } from "firebase/firestore";
import { initDriver } from "../../constants";
import { useNavigate, useSearchParams } from "react-router-dom";

const Drivers = () => {
  const [search, setSearch] = useState("");
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [driver, setDriver] = useState<Driver>(initDriver);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchParams] = useSearchParams();
  const { setSnapshotProps } = useOnSnapshotContext<Driver>();
  const navigate = useNavigate();

  useEffect(() => {
    const query: QueryConstraint[] = [orderBy("name")];

    if (search) {
      query.push(...[startAt(search), endAt(search + "\uf8ff")]);
    }

    setSnapshotProps({
      collection: "drivers",
      query,
      whitPropsDateFormated: true
    });
  }, [search]);

  useEffect(() => {
    const idEdit = searchParams.get("editar");

    if (!idEdit) return;

    setDriver(drivers.find(d => d.id === idEdit)!);
    setOpenModalCreate(true);
  }, [searchParams, drivers]);

  const columns = useMemo<ColumnsType<Driver>>(() => {
    return [
      { title: "Nombre", dataIndex: "name" },
      { title: "Telefono", dataIndex: "phone" },
      { title: "Correo", dataIndex: "email" },
      { title: "Edad", dataIndex: "age" },
      { title: "Creado por", dataIndex: "createdByEmail" },
      {
        title: "Fecha de creación",
        dataIndex: "createdAtFormated",
        sorter: (a, b) => a.createdAtFormated!.localeCompare(b.createdAtFormated!)
      },
      {
        title: "Fecha de modificación",
        dataIndex: "updatedAtFormated",
        sorter: (a, b) => a.updatedAtFormated!.localeCompare(b.updatedAtFormated!)
      },
    ];
  }, []);

  return (
    <div>
      <br />
      <Row justify="end">
        <Col>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setDriver(initDriver);
              setOpenModalCreate(true);
            }}
          >
            Nuevo chofer
          </Button>
        </Col>
      </Row>
      <br />
      <Input.Search
        placeholder="Buscar por nombre"
        allowClear
        onSearch={(value) => setSearch(value)}
        style={{ width: "100%" }}
        enterButton
      />
      <br />
      <br />
      <TableContext
        columns={columns}
        pathEdit={""}
        showActionsButtons
        onLoadData={setDrivers}
      />
      <ModalCreateDriver
        open={openModalCreate}
        onClose={() => {
          setDriver(initDriver);
          setOpenModalCreate(false);
          navigate("/choferes");
        }}
        driver={driver}
      />
    </div>
  );
};

export default Drivers;