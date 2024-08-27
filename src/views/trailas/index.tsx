import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, message, Row, Switch, } from "antd";
import { ReloadOutlined, HistoryOutlined } from '@ant-design/icons';
import { Traila, TrailaFilters } from "../../interfaces/traila";
import { endAt, orderBy, QueryConstraint, startAt, where } from "firebase/firestore";
import { ColumnsType } from "antd/es/table";
import { columnsExcelTrailas, initTraila } from "../../constants";
import ModalHistoryChangeTires from "./modalHistoryChangeTires";
import ModalUpdateTrailaTires from "./modalUpdateTrailaTires";
import ButtonUploadTrailas from "./buttonUploadTrailas";
import FiltersTrailas from "./filtersTrailas";
import ButtonDownloadExcel from "../../components/buttonDownloadExcel";
import ButtonUploadChangeTires from "./buttonUploadChangeTires";
import { update } from "../../services/firebase/firestore";
import { useOnSnapshot } from "../../context/snapshotContext";
import TableContext from "../../components/tableContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import ModalUpdateTraila from "./modalUpdateTraila";

const Trailas = () => {
  const [filters, setFilters] = useState<TrailaFilters>({
    name: "",
    category: "",
    driver: "",
    sizesTires: ""
  });
  const [traila, setTraila] = useState<Traila>(initTraila);
  const [openUpdateTire, setOpenUpdateTire] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [idEdit, setIdEdit] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [drivers, setDrivers] = useState<string[]>([]);
  const { data: trailas, setData: setTrailas, setSnapshotProps } = useOnSnapshot<Traila>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const { category, sizesTires, driver, name } = filters;
    const query: QueryConstraint[] = [orderBy("name")];

    if (category) {
      query.push(where("category", "==", category));
    }

    if (sizesTires) {
      query.push(where("sizesTires", "==", sizesTires));
    }

    if (driver) {
      query.push(where("driver", "==", driver));
    }

    if (name) {
      query.push(...[startAt(name), endAt(name + "\uf8ff")]);
    }

    setSnapshotProps({
      collection: "trailas",
      query,
      whitPropsDateFormated: true,
    });
  }, [filters]);

  useEffect(() => {
    const idEdit = searchParams.get("editar");

    setIdEdit(idEdit || "");
  }, [searchParams]);

  const onChangeAlignment = useCallback(async (value: boolean, id: string) => {
    setTrailas(prevTrailas => prevTrailas.map(traila => traila.id === id ? { ...traila, aligning: true } : traila));

    try {
      await update("trailas", id, { aligned: value });
    } catch (error) {
      console.log(error);
      message.error("Error al cambiar el estado de la alineación.");
    } finally {
      setTrailas(prevTrailas => prevTrailas.map(traila => traila.id === id ? { ...traila, aligning: false } : traila));
    }
  }, []);

  const columns = useMemo<ColumnsType<Traila>>(() => {
    return [
      { title: "Nombre", dataIndex: "name" },
      { title: "Categoría", dataIndex: "category" },
      { title: "Tipo de llanta", dataIndex: "sizesTires" },
      { title: "Chofer", dataIndex: "driver" },
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
      {
        title: "Llantas cambiadas",
        dataIndex: "tiresChanged",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.tiresChanged - b.tiresChanged
      },
      {
        title: "Alineada",
        dataIndex: "aligned",
        render: (_, traila) => ((
          <Switch
            defaultChecked={traila.aligned}
            loading={traila.aligning}
            onChange={value => onChangeAlignment(value, traila.id!)}
          />
        ))
      },
      {
        fixed: "right",
        width: 82,
        title: "Cambio llantas",
        dataIndex: "changeTires",
        render: (_, traila) => ((
          <Button
            type="primary"
            shape="circle"
            icon={<ReloadOutlined />}
            onClick={() => {
              setTraila(traila);
              setOpenUpdateTire(true);
            }}
          />
        ))
      },
      {
        fixed: "right",
        width: 86,
        title: "Historial cambios",
        dataIndex: "historyChanges",
        render: (_, traila) => ((
          <Button
            type="primary"
            shape="circle"
            icon={<HistoryOutlined />}
            onClick={() => {
              setTraila(traila);
              setOpenHistory(true);
            }}
          />
        ))
      }
    ];
  }, [onChangeAlignment]);

  const onCloseUpdateTraila = () => {
    setTraila(initTraila);
    navigate("/trailas");
  };

  const onCloseUpdateTrailaTires = () => {
    setTraila(initTraila);
    setOpenUpdateTire(false);
  };

  const onCloseHistoryChangeTires = () => {
    setTraila(initTraila);
    setOpenHistory(false);
  };

  return (
    <div>
      <br />
      <Row gutter={10}>
        <Col>
          <ButtonUploadTrailas />
        </Col>
        <Col>
          <ButtonUploadChangeTires />
        </Col>
        <Col>
          <ButtonDownloadExcel
            buttonText="Descargar trailas"
            fileName="Trailas"
            nameWorksheet="Trailas"
            columns={columnsExcelTrailas}
            data={trailas}
          />
        </Col>
      </Row>
      <br />
      <FiltersTrailas
        setFilters={setFilters}
        onLoadCategories={setCategories}
        onLoadDrivers={setDrivers}
      />
      <br />
      <br />
      <TableContext
        columns={columns}
        pathEdit=""
        onLoadData={setTrailas}
        showActionsButtons
      />
      <ModalUpdateTrailaTires
        open={openUpdateTire}
        traila={traila}
        onCancel={() => onCloseUpdateTrailaTires()}
        onClose={() => onCloseUpdateTrailaTires()}
      />
      <ModalHistoryChangeTires
        open={openHistory}
        traila={traila}
        onCancel={() => onCloseHistoryChangeTires()}
        onClose={() => onCloseHistoryChangeTires()}
      />
      <ModalUpdateTraila
        open={Boolean(idEdit)}
        traila={trailas.find(t => t.id === idEdit)}
        onCancel={() => onCloseUpdateTraila()}
        onClose={() => onCloseUpdateTraila()}
        categories={categories}
        drivers={drivers}
      />
    </div>
  );
};

export default Trailas;