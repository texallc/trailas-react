import { message, ModalProps } from "antd";
import Form from "antd/es/form";
import Modal from "../../../components/modal";
import { SizeTires, Tires, TiresChangedByTraila, Traila } from "../../../interfaces/traila";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { create, update } from "../../../services/firebase/firestore";
import TireChangeInputs from "./tireChangeInputs";
import FormTraila from "../formTraila";
import { increment } from "firebase/firestore";
import { initTiresChangedByTraila } from "../../../constants";

interface Props extends ModalProps {
  traila: Traila;
  onClose: () => void;
}

const ModalUpdateTrailaTires = ({ traila, onClose, ...props }: Props) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!traila.id || loading) return;

    const { tire1, tire2, tire3, tire4, tire5, tire6, tire7, tire8 } = traila;
    const tires: Tires = { tire1, tire2, tire3, tire4, tire5, tire6, tire7, tire8 };

    const tiresChangeByTraila: TiresChangedByTraila = {
      ...initTiresChangedByTraila,
      name: traila.name,
      category: traila.category,
      ...tires,
    };

    form.setFieldsValue(tiresChangeByTraila);
  }, [user, traila, form, props.open]);


  const saveChangeTire = async (tiresChangeByTraila: TiresChangedByTraila) => {
    try {
      if (!traila.id || saving) return;

      setSaving(true);

      const { tire1, tire2, tire3, tire4, tire5, tire6, tire7, tire8 } = tiresChangeByTraila;
      const newTires: Tires = { tire1, tire2, tire3, tire4, tire5, tire6, tire7, tire8 };
      let newTiresChangedByTraila: TiresChangedByTraila = { ...tiresChangeByTraila, createdAt: new Date() };
      let tiresChanged = 0;

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

      await Promise.all([
        update("trailas", traila.id!, { ...newTires, tiresChanged: increment(tiresChanged), updatedAt: new Date() }),
        create("tiresChangedByTraila", {
          ...newTiresChangedByTraila,
          createdBy: user!.uid,
          idTraila: traila.id,
          createdByEmail: user!.email!
        })
      ]);

      message.success("Cambio de llantas guardado correctamente!");

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
      onClose={onClose}
      onOk={() => form.submit()}
    >
      <h3>Cambio de llantas</h3>
      <FormTraila
        form={form}
        onFinish={saveChangeTire}
      >
        <TireChangeInputs />
      </FormTraila>
    </Modal>
  );
};

export default ModalUpdateTrailaTires;