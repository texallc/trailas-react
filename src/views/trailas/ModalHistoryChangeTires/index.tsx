import { Modal, ModalProps } from "antd";
import Form from "antd/es/form";
import { TiresChangedByTraila, Traila } from "../../../interfaces/traila";
import FormTraila from "../formTraila";
import { useEffect, useMemo } from "react";
import { orderBy, QueryConstraint, where } from "firebase/firestore";
import Table from "../../../components/table";
import { ColumnsType } from "antd/es/table";

interface Props extends ModalProps {
  traila: Traila;
  onClose: () => void;
}

const ModalHistoryChangeTires = ({ traila, onClose, ...props }: Props) => {
  const [form] = Form.useForm();
  const query = useMemo<QueryConstraint[]>(() => {
    if (!traila.id) return [];

    return [where("idTraila", "==", traila.id), orderBy("createdAt", "desc")];
  }, [traila]);
  const columns = useMemo<ColumnsType<TiresChangedByTraila>>(() => {
    return [
      { title: "Creado por", dataIndex: "createdByEmail" },
      { title: "Fecha de creación", dataIndex: "createdAtFormated" },
      { title: "Llanta 1", dataIndex: "tire1" },
      { title: "Llanta 2", dataIndex: "tire2" },
      { title: "Llanta 3", dataIndex: "tire3" },
      { title: "Llanta 4", dataIndex: "tire4" },
      { title: "Llanta 5", dataIndex: "tire5" },
      { title: "Llanta 6", dataIndex: "tire6" },
      { title: "Llanta 7", dataIndex: "tire7" },
      { title: "Llanta 8", dataIndex: "tire8" },
    ];
  }, []);

  useEffect(() => {
    if (!traila.id) return;

    form.setFieldsValue(traila);
  }, [traila, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      {...props}
      cancelButtonProps={{
        style: {
          display: "none"
        }
      }}
      okText="Cerrar"
      onClose={handleClose}
      onOk={handleClose}
      width={"85vw"}
    >
      <h3>Historial de cambio de llantas</h3>
      <FormTraila
        form={form}
        onFinish={() => { }}
      />
      <Table
        collection="tiresChangedByTraila"
        columns={columns}
        pathEdit=""
        query={query}
        whitPropsDateFormated
        wait={!traila.id}
      />
    </Modal>
  );
};

export default ModalHistoryChangeTires;