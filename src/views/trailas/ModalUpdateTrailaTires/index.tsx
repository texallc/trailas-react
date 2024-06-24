import { message, ModalProps } from "antd";
import Form from "antd/es/form";
import Modal from "../../../components/modal";
import { Tires, TiresChangedByTraila, Traila } from "../../../interfaces/traila";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { create, update } from "../../../services/firebase/firestore";
import TireChangeInputs from "./tireChangeInputs";
import FormTraila from "../formTraila";

interface Props extends ModalProps {
  traila: Traila;
  onClose: () => void;
}

const ModalUpdateTrailaTires = ({ traila, onClose, ...props }: Props) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!traila.id) return;

    form.setFieldsValue(traila);
  }, [traila, form, props.open]);

  const saveChangeTire = async (newTraila: Traila) => {
    try {
      if (!traila.id || saving) return;

      setSaving(true);

      const { tire1, tire2, tire3, tire4, tire5, tire6, tire7, tire8 } = newTraila;
      const newTires: Tires = { tire1, tire2, tire3, tire4, tire5, tire6, tire7, tire8 };
      let tiresChanged = traila.tiresChanged;

      let newTiresChangedByTraila: TiresChangedByTraila = {
        name: newTraila.name,
        category: newTraila.category,
        createdAt: new Date(),
        createdBy: user!.uid,
        idTraila: traila.id,
        createdByEmail: user!.email!,
        ...newTires,
      };

      (Object.keys(newTiresChangedByTraila)
        .filter(key => key.includes("tire")) as (keyof Tires)[])
        .forEach(key => {
          const oldValueTire = traila[key];
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

      await update("trailas", traila.id!, { ...newTires, tiresChanged });
      await create("tiresChangedByTraila", newTiresChangedByTraila);

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