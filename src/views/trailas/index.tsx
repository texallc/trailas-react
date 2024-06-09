import { useCallback, useMemo, useState } from "react";
import { Button, message, Upload, UploadProps } from "antd";
import { UploadOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { getWorkbookFromFile } from "../../utils/functions";
import { bulkCreate, update } from "../../services/firebase/firestore";
import { Traila } from "../../interfaces/trailas";
import { useAuth } from "../../context/authContext";
import { arrayUnion, orderBy } from "firebase/firestore";
import Table from "../../components/table";
import { ColumnsType } from "antd/es/table";
import { TrailaProvider } from '../../context/trailaContext';

const Trailas = () => {
  const { user } = useAuth();
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [loading, setLoading] = useState(false);

  const updateTraialTire = useCallback(async (countTire: number) => {
    try {

    } catch (error) {
      console.log(error);
      message.error("Error al actualizar el cambio de llanta", 4);
    }
  }, []);

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
                orderImage: "",
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          });

          const categories: string[] = [...new Set(trailas.map(c => c.category))];

          update("trailaCategories", "filters", { categories: arrayUnion(...categories) });

          await bulkCreate("trailas", trailas);

          message.success("Trailas importadas correctamente!", 4);
        } catch (error) {
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
      {
        title: "Cambios de llantas",
        dataIndex: "tiresChanged",
        render: (_, { tiresChanged, changingTire }) =>
          <div style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}>
            {tiresChanged}
            <div
              style={{
                display: "grid",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Button
                shape="circle"
                type="primary"
                icon={<PlusOutlined />}
                loading={changingTire}
                onClick={() => updateTraialTire(1)}
              />
              <Button
                shape="circle"
                type="primary"
                icon={<MinusOutlined />}
                loading={changingTire}
                onClick={() => updateTraialTire(-1)}
              />
            </div >
          </div>
      },
      { title: "Creado por", dataIndex: "createdBy" },
      { title: "Fecha de creación", dataIndex: "createdAtFormated" },
      { title: "Fecha de modificación", dataIndex: "updatedAtFormated" }
    ];
  }, [updateTraialTire]);

  return (
    <TrailaProvider>
      <div style={{ padding: 40 }}>
        <Upload {...propsUpload}>
          <Button loading={loading} icon={<UploadOutlined />}>Importar trailas</Button>
        </Upload>
        <br />
        <Table
          collection="trailas"
          columns={columns}
          pathEdit=""
          query={[orderBy("name")]}
          whitPropsDateFormated
        />
      </div>
    </TrailaProvider>

  );
};

export default Trailas;