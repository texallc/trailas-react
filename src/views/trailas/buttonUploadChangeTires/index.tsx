
import { useState, useMemo } from "react";
import { Button, message, Upload, UploadProps } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { UploadOutlined } from '@ant-design/icons';
import { getArrayChunk, getWorkbookFromFile } from "../../../utils/functions";
import { SizeTires, SizeTiresUpload, Tires, TiresChangedByTraila, Traila, UploadTiresChangedByTraila } from "../../../interfaces/traila";
import { FieldValue, increment, where } from "firebase/firestore";
import { bulkCreate, bulkUpdate, getCollectionDocs } from "../../../services/firebase/firestore";
import { useAuth } from "../../../context/authContext";
import { initSizeTiresUpload, initTires, sideTiresUploadChange } from "../../../constants";

interface UpdateTrailaByUpload {
  id: string;
  [x: string]: string | Date | FieldValue;
  tiresChanged: FieldValue;
  updatedAt: Date;
}

const ButtonUploadChangeTires = () => {
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

          let uploadChangeTires: UploadTiresChangedByTraila[] = [];

          ws.eachRow((row) => {
            const name = row.getCell(1).value?.toString();
            const side = row.getCell(2).value?.toString();
            const size = row.getCell(3).value?.toString();

            if (name && side && size) uploadChangeTires.push({ name, side, size });
          });

          const newTireError = uploadChangeTires.find(t => !Object.keys(sideTiresUploadChange).includes(t.side));

          //falta validar tambien el formato de medida
          if (newTireError) {
            message.error(`El formato del lado de la llanta no es válido. Llanta: ${newTireError.name}, lado: ${newTireError.side}`, 5);
          }

          const uploadChangeTiresChunk = getArrayChunk(uploadChangeTires, 10);

          const trailaDocs = (await Promise.all(
            uploadChangeTiresChunk.map((traila) => {
              const names = traila.map((t) => t.name);

              return getCollectionDocs("trailas", [where("name", "in", names)]);
            })
          )).flatMap(doc => doc.docs)
            .map(doc => ({ ...doc.data(), id: doc.id })) as Traila[];

          uploadChangeTires = uploadChangeTires.filter(t => trailaDocs.some(d => d.name === t.name));

          const uploadChangeTiresChunk500 = getArrayChunk(uploadChangeTires, 500);

          for (const _uploadChangeTires of uploadChangeTiresChunk500) {
            const dataToUpdate = _uploadChangeTires.map(newTiresChangedByTraila => {
              const traila = trailaDocs.find(t => t.name === newTiresChangedByTraila.name)!;
              const tires: Tires = { ...initTires };
              let sizeTires: SizeTiresUpload = { ...initSizeTiresUpload };
              const keyTire = sideTiresUploadChange[newTiresChangedByTraila.side];
              const keySizeTire = `sizeT${keyTire.substring(1)}` as keyof SizeTires;

              tires[keyTire] = 1;
              sizeTires[keySizeTire] = newTiresChangedByTraila.size;

              const tireChangeByTraila: TiresChangedByTraila = {
                name: traila.name,
                category: traila.category,
                createdBy: user!.uid,
                idTraila: traila.id!,
                createdByEmail: user!.email!,
                repairOrders: [],
                createdAt: new Date(),
                ...tires,
                ...sizeTires,
              };

              const updateTire: UpdateTrailaByUpload = {
                id: traila.id!,
                [keyTire]: increment(1),
                tiresChanged: increment(1),
                updatedAt: new Date()
              };

              return { tireChangeByTraila, updateTire };
            });


            await bulkCreate("tiresChangedByTraila", dataToUpdate.map(d => d.tireChangeByTraila));
            await bulkUpdate("trailas", dataToUpdate.map(d => d.updateTire));
          }

          message.success("Cambio de llantas cargado correctamente!", 4);
        } catch (error) {
          message.error("Error al cargar el cambio de llantas", 4);
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
      <Button loading={loading} icon={<UploadOutlined />}>Cargar cambio de llantas</Button>
    </Upload>
  );
};

export default ButtonUploadChangeTires;