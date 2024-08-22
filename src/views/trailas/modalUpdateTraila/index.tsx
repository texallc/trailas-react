import { useEffect, useState } from "react";
import { message, ModalProps } from "antd";
import Form from "antd/es/form";
import Modal from "../../../components/modal";
import { Traila } from "../../../interfaces/traila";
import { useAuth } from "../../../context/authContext";
import BaseInputsTraila from "../../../components/baseInputsTraila";
import { update } from "../../../services/firebase/firestore";

interface Props extends ModalProps {
  traila?: Traila;
  onClose: () => void;
  categories: string[];
}

const ModalUpdateTraila = ({ traila, onClose, categories, ...props }: Props) => {
  const [form] = Form.useForm<Traila>();
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!traila || !traila.id || loading) return;

    form.setFieldsValue({ ...traila, sizesTires: traila.sizesTires || "" });
  }, [user, traila, form, props.open]);

  const saveTraila = async (traila: Traila) => {
    if (saving) return;

    setSaving(true);

    try {
      await update("trailas", traila.id!, traila);

      message.success("Traila actualizada correctamente!.", 4);

      onClose();
    } catch (error) {
      console.log(error);
      message.error("Error al actualizar la traila.");
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
          onFinish={saveTraila}
        >
          {children}
        </Form>
      )}
    >
      <h3>Editar traila</h3>
      <BaseInputsTraila categories={categories} />
    </Modal>
  );
};

export default ModalUpdateTraila;