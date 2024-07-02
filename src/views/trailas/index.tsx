import { useMemo, useState } from "react";
import { Button, Col, Row, } from "antd";
import { ReloadOutlined, HistoryOutlined } from '@ant-design/icons';
import { Traila } from "../../interfaces/traila";
import { endAt, orderBy, QueryConstraint, startAt, where } from "firebase/firestore";
import Table from "../../components/table";
import { ColumnsType } from "antd/es/table";
import { initTraila } from "../../constants";
import ModalHistoryChangeTires from "./modalHistoryChangeTires";
import ModalUpdateTrailaTires from "./modalUpdateTrailaTires";
import ButtonUploadTrailas from "./buttonUploadTrailas";
import FiltersTrailas from "./filtersTrailas";
import ButtonDownloadExcel from "../../components/buttonDownloadExcel";

const Trailas = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [traila, setTraila] = useState<Traila>(initTraila);
  const [openUpdateTire, setOpenUpdateTire] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [trailas, setTrailas] = useState<Traila[]>([]);

  const query = useMemo(() => {
    const query: QueryConstraint[] = [orderBy("name")];

    if (category) {
      query.push(where("category", "==", category));
    }

    if (search) {
      query.push(...[startAt(search), endAt(search + "\uf8ff")]);
    }

    return query;
  }, [category, search]);

  const columns = useMemo<ColumnsType<Traila>>(() => {
    return [
      { title: "Nombre", dataIndex: "name" },
      { title: "Categoría", dataIndex: "category" },
      { title: "Creado por", dataIndex: "createdBy" },
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
        title: "LLantas cambiadas",
        dataIndex: "tiresChanged",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.tiresChanged - b.tiresChanged
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
  }, []);

  return (
    <div>
      <br />
      <Row gutter={10}>
        <Col>
          <ButtonUploadTrailas />
        </Col>
        <Col>
          <ButtonDownloadExcel
            buttonText="Descargar trailas"
            fileName="Trailas"
            nameWorksheet="Trailas"
            columns={[
              {
                header: "Nombre",
                key: "name",
                width: 32
              },
              {
                header: "Categoría",
                key: "category",
                width: 32
              },
              {
                header: "Creado por",
                key: "createdBy",
                width: 32
              },
              {
                header: "Fecha de creación",
                key: "createdAtFormated",
                width: 32
              },
              {
                header: "Fecha de modificación",
                key: "updatedAtFormated",
                width: 32
              },
              {
                header: "LLantas cambiadas",
                key: "tiresChanged",
                width: 32
              }
            ]}
            data={trailas}
          />
        </Col>
      </Row>
      <br />
      <FiltersTrailas
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
      />
      <br />
      <br />
      <Table
        collection="trailas"
        columns={columns}
        pathEdit=""
        query={query}
        whitPropsDateFormated
        onLoadData={setTrailas}
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
    </div >
  );
};

export default Trailas;