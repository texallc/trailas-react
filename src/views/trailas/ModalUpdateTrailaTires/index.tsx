import { message, ModalProps, UploadFile } from "antd";
import Form from "antd/es/form";
import Modal from "../../../components/modal";
import { SizeTires, Tires, TiresChangedByTraila, Traila } from "../../../interfaces/traila";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { create, update, uploadFiles } from "../../../services/firebase/firestore";
import TireChangeInputs from "./tireChangeInputs";
import { collection, doc, increment, runTransaction } from "firebase/firestore";
import { initSizeTires, initTiresChangedByTraila } from "../../../constants";
import ButtonUploadOrderRepair from "../../../components/buttonUploadOrderRepair";
import { UploadChangeParam } from "antd/es/upload";
import BaseInputsTraila from "../../../components/baseInputsTraila";
import { db } from "../../../services/firebase";

interface Props extends ModalProps {
  traila: Traila;
  onClose: () => void;
}

const ModalUpdateTrailaTires = ({ traila, onClose, ...props }: Props) => {
  const [form] = Form.useForm<TiresChangedByTraila>();
  //const formValues = Form.useWatch<TiresChangedByTraila>([], form);
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [tiresChangeByTraila, setTiresChangeByTraila] = useState(initTiresChangedByTraila);

  useEffect(() => {
    if (!traila.id || loading) return;

    const { tire1, tire2, tire3, tire4, tire5, tire6, tire7, tire8 } = traila;
    const tires: Tires = { tire1, tire2, tire3, tire4, tire5, tire6, tire7, tire8 };
    const sizeTires: SizeTires = { ...initSizeTires };

    Object.keys(initSizeTires).forEach(key => {
      const k = key as keyof SizeTires;
      sizeTires[k] = "";
    });

    const _tiresChangeByTraila: TiresChangedByTraila = {
      ...initTiresChangedByTraila,
      ...sizeTires,
      ...tires,
      name: traila.name,
      category: traila.category,
      sizesTires: traila.sizesTires,
    };

    setTiresChangeByTraila(_tiresChangeByTraila);
    setFileList([]);
    form.setFieldsValue({ ..._tiresChangeByTraila, notes: "" });
  }, [user, traila, form, props.open]);

  const saveChangeTire = async (_tiresChangeByTraila: TiresChangedByTraila) => {
    try {
      if (!traila.id || saving) return;

      setSaving(true);

      const { tire1, tire2, tire3, tire4, tire5, tire6, tire7, tire8, repairOrders } = _tiresChangeByTraila;
      const newTires: Tires = { tire1, tire2, tire3, tire4, tire5, tire6, tire7, tire8 };
      let newTiresChangedByTraila: TiresChangedByTraila = { ...initTiresChangedByTraila, ..._tiresChangeByTraila, };

      if (JSON.stringify(tiresChangeByTraila) === JSON.stringify(newTiresChangedByTraila)) {
        message.warning("No se ha hecho ningún cambio de llantas.");
        return;
      }

      let tiresChanged = 0;

      //falta usar increment para la concurrencia
      (Object.keys(newTiresChangedByTraila)
        .filter(key => key.includes("tire")) as (keyof Tires)[])
        .forEach(key => {
          const keySizeTires = `sizeT${key.substring(1)}` as keyof SizeTires;

          if (typeof newTiresChangedByTraila[keySizeTires] === "undefined") {
            newTiresChangedByTraila = { ...newTiresChangedByTraila, [keySizeTires]: "" };
          }

          const oldValueTire = traila[key as keyof Traila] as number;
          const newValueTire = newTiresChangedByTraila[key];

          if (oldValueTire > newValueTire) {
            const _tiresChanges = oldValueTire - newValueTire;
            tiresChanged -= _tiresChanges;

            newTiresChangedByTraila = {
              ...newTiresChangedByTraila,
              [key]: -Math.abs(_tiresChanges),
            };
          } else if (oldValueTire < newValueTire) {
            const _tiresChanges = newValueTire - oldValueTire;
            tiresChanged += _tiresChanges;

            newTiresChangedByTraila = {
              ...newTiresChangedByTraila,
              [key]: _tiresChanges,
            };
          } else {
            newTiresChangedByTraila = {
              ...newTiresChangedByTraila,
              [key]: 0,
            };
          }
        });

      let urlRepairOrders: string[] = [];

      if (!Array.isArray(repairOrders)) {
        const uploadChangeParam = repairOrders as UploadChangeParam<UploadFile<any>>;

        urlRepairOrders = await uploadFiles("repairOrders", uploadChangeParam.fileList.map(f => f.originFileObj!));
      }

      delete newTiresChangedByTraila.id;
      delete newTiresChangedByTraila.sizesTires;

      if (typeof newTiresChangedByTraila.driver === "undefined") {
        delete newTiresChangedByTraila.driver;
      }

      await runTransaction(db, async (transaction) => {
        transaction.update(
          doc(db, "trailas", traila.id!),
          {
            ...newTires,
            tiresChanged: increment(tiresChanged),
            updatedAt: new Date()
          }
        );

        transaction.set(doc(collection(db, "tiresChangedByTraila")), {
          ...newTiresChangedByTraila,
          createdBy: user!.uid,
          idTraila: traila.id,
          createdByEmail: user!.email!,
          repairOrders: urlRepairOrders,
          createdAt: new Date()
        });
      });

      message.success("Cambio de llantas guardado correctamente!", 4);
      onClose();
    } catch (error) {
      console.log(error);
      message.error("Error al guardar el cambio de llantas.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      {...props}
      onCancel={onClose}
      forceRender
      destroyOnClose
      onClose={onClose}
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      modalRender={(children) => (
        <Form
          layout="vertical"
          clearOnDestroy
          form={form}
          onFinish={saveChangeTire}
        >
          {children}
        </Form>
      )}
    >
      <h3>Cambio de llantas</h3>
      <BaseInputsTraila disableInputs />
      <ButtonUploadOrderRepair
        fileList={fileList}
        setFileList={setFileList}
      />
      <br />
      <TireChangeInputs />
    </Modal>
  );
};

export default ModalUpdateTrailaTires;