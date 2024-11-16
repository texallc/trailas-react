import { Button, message, Space, Modal } from 'antd';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DeleteButton from "../deleteButton";
import { delDoc } from "../../services/firebase/firestore";

interface Props<T> {
  path: string;
  record: T;
  onDeleted: () => void;
  pathEdit: string;
}

const dialogDelete = (path: string, id: string) =>
  new Promise<void>((resolve) => Modal.confirm({
    title: 'Eliminar',
    icon: <ExclamationCircleOutlined />,
    content: '¿Seguro que deseas eliminar este registro?',
    okText: 'Aceptar',
    cancelText: 'Cancelar',
    onOk: async () => {
      try {
        await delDoc(path, id);
        message.success("Registro eliminado con exito!");
        resolve();
      } catch (error) {
        console.error(error);
        message.error("Error al eliminar el registro.", 4);
      }
    },
  }));

const TableActionsButtons = <T extends { id: string; }>({ record, onDeleted, pathEdit, path }: Props<T>) => {
  const navigate = useNavigate();

  const del = async () => {
    await dialogDelete(path, record.id);
    onDeleted();
  };

  const onEdit = () => {
    if (pathEdit) {
      navigate(pathEdit, { state: record });

      return;
    }

    navigate({
      search: `?editar=${record.id}`
    });
  };

  return (
    <Space>
      <Button
        icon={<EditOutlined />}
        shape="circle"
        onClick={() => onEdit()}
        size="middle"
        style={{ color: '#fff', backgroundColor: '#ec9822' }}
        type='default'
      />
      <DeleteButton onClick={del} />
    </Space>
  );
};

export default TableActionsButtons;