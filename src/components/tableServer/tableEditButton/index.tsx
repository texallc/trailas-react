import { FC } from 'react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: number;
  url: string;
}

const TableEditButton: FC<Props> = ({ id, url }) => {
  const navigate = useNavigate();

  return (
    <Button
      icon={<EditOutlined />}
      shape="circle"
      onClick={() => navigate(`${url.replace("/list", "")}&id=${id}`)}
      size="middle"
      style={{ color: '#fff', backgroundColor: '#ec9822 ' }}
      type='text'
    />
  );
};

export default TableEditButton;