import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, message, Row, Switch, } from "antd";
import { ReloadOutlined, HistoryOutlined } from '@ant-design/icons';
import { Traila } from "../../interfaces/traila";
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [traila, setTraila] = useState<Traila>(initTraila);
  const [openUpdateTire, setOpenUpdateTire] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [idEdit, setIdEdit] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const { data: trailas, setData: setTrailas, setSnapshotProps } = useOnSnapshot<Traila>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const query: QueryConstraint[] = [orderBy("name")];

    if (category) {
      query.push(where("category", "==", category));
    }

    if (search) {
      query.push(...[startAt(search), endAt(search + "\uf8ff")]);
    }

    setSnapshotProps({
      collection: "trailas",
      query,
      whitPropsDateFormated: true,
    });
  }, [category, search]);

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
        category={category}
        setCategory={setCategory}
        setSearch={setSearch}
        onLoadCategories={(categories) => setCategories(categories)}
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
        onCancel={() => setOpenUpdateTire(false)}
        onClose={() => setOpenUpdateTire(false)}
      />
      <ModalHistoryChangeTires
        open={openHistory}
        traila={traila}
        onCancel={() => setOpenHistory(false)}
        onClose={() => setOpenHistory(false)}
      />
      <ModalUpdateTraila
        open={Boolean(idEdit)}
        traila={trailas.find(t => t.id === idEdit)}
        onCancel={() => onCloseUpdateTraila()}
        onClose={() => onCloseUpdateTraila()}
        categories={categories}
      />
    </div>
  );
};

export default Trailas;