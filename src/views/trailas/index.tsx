import { useMemo, useState } from "react";
import { Button, Input, message, Select, Space, Upload, UploadProps } from "antd";
import { UploadOutlined, ReloadOutlined, HistoryOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { getWorkbookFromFile } from "../../utils/functions";
import { bulkCreate, update } from "../../services/firebase/firestore";
import { Traila } from "../../interfaces/traila";
import { useAuth } from "../../context/authContext";
import { arrayUnion, endAt, orderBy, QueryConstraint, startAt, where } from "firebase/firestore";
import Table from "../../components/table";
import { ColumnsType } from "antd/es/table";
import useCollection, { PropsUseCollection } from "../../hooks/useCollection";
import { initTires, initTraila } from "../../constants";
import ModalHistoryChangeTires from "./ModalHistoryChangeTires";
import ModalUpdateTrailaTires from "./ModalUpdateTrailaTires";

const Trailas = () => {
  const { user } = useAuth();
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [traila, setTraila] = useState<Traila>(initTraila);
  const [openUpdateTire, setOpenUpdateTire] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  const propsUseCollectionCategory = useMemo<PropsUseCollection>(() => {
    return {
      collection: "trailaCategories",
      query: [],
    };
  }, []);
  const { data: filtersCategories, loading: loadingCategories } = useCollection<{ categories: string[]; }>(propsUseCollectionCategory);

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

  const propsUpload = useMemo(() => {
    const propsUpload: UploadProps = {
      fileList,
      accept: ".xlsx",
      onChange: async ({ file }: UploadChangeParam<UploadFile<any>>) => {
        const rcFile = file.originFileObj;

        if (!rcFile) {
          message.error("No se encontró el archivo", 4);
          return;
        };

        try {
          const wb = await getWorkbookFromFile(rcFile);
          const ws = wb.getWorksheet(1);

          if (!ws) {
            message.error("No se encontró la hoja de trabajo", 4);
            return;
          }

          setLoading(true);

          const trailas: Traila[] = [];

          ws.eachRow((row) => {
            const name = row.getCell(1).value?.toString();
            const category = row.getCell(2).value?.toString();

            if (name && category) {
              trailas.push({
                name,
                category,
                tiresChanged: 0,
                createdBy: user!.uid,
                createdByEmail: user!.email!,
                orderImage: "",
                createdAt: new Date(),
                updatedAt: new Date(),
                ...initTires
              });
            }
          });

          const categories: string[] = [...new Set(trailas.map(c => c.category))];

          await update("trailaCategories", "filters", { categories: arrayUnion(...categories) });
          await bulkCreate("trailas", trailas);

          message.success("Trailas importadas correctamente!", 4);
        } catch (error) {
          message.error("Error al importar las trailas", 4);
          console.log(error);
        } finally {
          setFileList([]);
          setLoading(false);
        }
      },
      customRequest: ({ onSuccess }) => {
        setTimeout(() => {
          onSuccess!("ok");
        }, 0);
      },
    };

    return propsUpload;
  }, [fileList]);

  const columns = useMemo<ColumnsType<Traila>>(() => {
    return [
      { title: "Nombre", dataIndex: "name" },
      { title: "Categoría", dataIndex: "category" },
      { title: "Creado por", dataIndex: "createdBy" },
      { title: "Fecha de creación", dataIndex: "createdAtFormated" },
      { title: "Fecha de modificación", dataIndex: "updatedAtFormated" },
      { title: "LLantas cambiadas", dataIndex: "tiresChanged" },
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
      <Upload {...propsUpload}>
        <Button loading={loading} icon={<UploadOutlined />}>Importar trailas</Button>
      </Upload>
      <br />
      <Space.Compact style={{ width: "100%" }}>
        <Select
          style={{ width: "50%" }}
          loading={loadingCategories}
          value={category}
          onChange={setCategory}
          allowClear
        >
          {
            filtersCategories[0]?.categories?.map(c => (
              <Select.Option key={c}>{c}</Select.Option>
            ))
          }
        </Select>
        <Input.Search
          placeholder="Buscar por nombre"
          allowClear
          onSearch={(value) => setSearch(value)}
          style={{ width: "100%" }}
          enterButton
        />
      </Space.Compact>
      <br />
      <br />
      <Table
        collection="trailas"
        columns={columns}
        pathEdit=""
        query={query}
        whitPropsDateFormated
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