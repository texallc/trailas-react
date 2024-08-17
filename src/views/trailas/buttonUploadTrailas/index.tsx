
import { useState, useMemo } from "react";
import { Button, message, Upload, UploadProps } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { UploadOutlined } from '@ant-design/icons';
import { getWorkbookFromFile } from "../../../utils/functions";
import { bulkCreate, update } from "../../../services/firebase/firestore";
import { initTires } from "../../../constants";
import { useAuth } from "../../../context/authContext";
import { arrayUnion } from "firebase/firestore";
import { Traila } from "../../../interfaces/traila";

const ButtonUploadTrailas = () => {
  const { user } = useAuth();
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [loading, setLoading] = useState(false);

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
                createdAt: new Date(),
                updatedAt: new Date(),
                ...initTires
              });
            }
          });

          const categories: string[] = [...new Set(trailas.map(c => c.category))];

          await update("trailaCategories", "filters", { categories: arrayUnion(...categories) });
          await bulkCreate("trailas", trailas);

          message.success("Trailas cargadas correctamente!", 4);
        } catch (error) {
          message.error("Error al cargar las trailas", 4);
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

  return (
    <Upload {...propsUpload}>
      <Button loading={loading} icon={<UploadOutlined />}>Cargar trailas</Button>
    </Upload>
  );
};

export default ButtonUploadTrailas;