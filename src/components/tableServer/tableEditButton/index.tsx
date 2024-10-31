import { FC } from 'react';
import { Button, message, Space, Modal } from 'antd';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: number;
  onUpdated: () => void;
}

const dialogDelete = (fun: () => Promise<unknown>) =>
  new Promise<void>((resolve) => Modal.confirm({
    title: 'Eliminar',
    icon: <ExclamationCircleOutlined />,
    content: '¿Seguro que deseas eliminar este registro?',
    okText: 'Aceptar',
    cancelText: 'Cancelar',
    onOk: async () => {
      try {
        await fun();
        message.success("Registro eliminado con exito!");
        resolve();
      } catch (error) {
        console.error(error);
        message.error("Error al eliminar el registro.", 4);
      }
    },
  }));

const TableEditButton: FC<Props> = ({ id, onUpdated }) => {
  const navigate = useNavigate();

  /*   const del = async () => {
      if (!funDelete) return;
  
      await dialogDelete(funDelete);
      onDeleted();
    }; funDelete ? <DeleteButton onClick={del} /> : null */

  return (
    <Button
      icon={<EditOutlined />}
      shape="circle"
      onClick={() => navigate({ search: `?editar=${id}` })}
      size="middle"
      style={{ color: '#fff', backgroundColor: '#ec9822 ' }}
      type='text'
    />
  );
};

export default TableEditButton;