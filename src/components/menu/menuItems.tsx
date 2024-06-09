import { HomeOutlined, SettingOutlined, LogoutOutlined, AuditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { message } from "antd";
import { getAuth } from "firebase/auth";
import { MdLocalShipping } from 'react-icons/md';

const styleIcon = {
  fontSize: 20
};

const menuItems = [
  {
    key: '/inicio',
    title: '',
    label: <Link to="/inicio">Inicio</Link>,
    icon: <HomeOutlined style={styleIcon} />
  },
  {
    key: '/trailas',
    title: '',
    label: <Link to="/trailas">Trailas</Link>,
    icon: <MdLocalShipping style={styleIcon} />
  },
  {
    key: '/configuracion',
    title: '',
    icon: <SettingOutlined style={styleIcon} />,
    label: 'Configuración',
    children: [
      {
        key: '/signOut',
        title: '',
        icon: <LogoutOutlined style={styleIcon} />,
        label: 'Cerrar sesión',
        onClick: async () => {
          try {
            await getAuth().signOut();
          } catch (error) {
            console.log(error);
            message.error("Error al cerrar sesión.", 4);
          }
        }
      }
    ]
  }
];

export default menuItems;
