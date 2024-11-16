import { FC } from 'react';
import { message, Modal, Switch } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { patch } from "../../../services/http";
import { useLocation } from "react-router-dom";
import useAbortController from "../../../hooks/useAbortController";

interface ChangeStatusProps { id: number; active: boolean; }

interface Props {
  record: ChangeStatusProps;
  onDeleted: () => void;
}

const TableDeleteButton: FC<Props> = ({ onDeleted, record }) => {
  const { pathname } = useLocation();
  const abortController = useAbortController();

  const dialogDelete = () =>
    new Promise<void>((resolve) => Modal.confirm({
      title: 'Eliminar',
      icon: <ExclamationCircleOutlined />,
      content: '¿Seguro que deseas desactivar este registro?',
      okText: 'Aceptar',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await patch(`${pathname}/update`, { ...record, active: !record.active } as unknown as Record<string, unknown>, abortController.current!);
          message.success("Registro desactivado con exito!");
          resolve();
        } catch (error) {
          console.error(error);
          message.error("Error al desactivar el registro.", 4);
        }
      },
    }));

  const del = async () => {
    await dialogDelete();
    onDeleted();
  };

  return (
    <Switch onChange={del} checked={record.active} />
  );
};

export default TableDeleteButton;