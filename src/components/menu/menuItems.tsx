import { HomeOutlined, SettingOutlined, LogoutOutlined, UserOutlined, AppstoreOutlined, ToolOutlined, InboxOutlined, ShoppingOutlined, SwapOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { message } from "antd";
import { getAuth } from "firebase/auth";
import { MdLocalShipping } from 'react-icons/md';
import { GrUserPolice } from "react-icons/gr";

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
    key: "/choferes",
    title: '',
    label: <Link to="/choferes">Choferes</Link>,
    icon: <GrUserPolice style={styleIcon} />
  },
  {
    key: "/usuarios",
    title: '',
    label: <Link to="/usuarios?pagina=1&limite=10">Usuarios</Link>,
    icon: <UserOutlined style={styleIcon} />
  },
  {
    key: "/categorias",
    title: "",
    label: <Link to="/categorias?pagina=1&limite=10">Categorias</Link>,
    icon: <AppstoreOutlined style={styleIcon} />
  },
  {
    key: "/productos",
    title: "",
    label: <Link to="/productos?pagina=1&limite=10">Productos</Link>,
    icon: <ToolOutlined style={styleIcon} />
  },
  {
    key: "/inventarios",
    title: "",
    label: <Link to="/inventarios?pagina=1&limite=10">Inventarios</Link>,
    icon: <InboxOutlined style={styleIcon} />
  },
  {
    key: "/movimientos",
    title: "",
    label: <Link to="/movimientos?pagina=1&limite=10">Movs. de inv.</Link>,
    icon: <SwapOutlined style={styleIcon} />
  },
  {
    key: "/ventas",
    title: "",
    label: <Link to="/ventas?pagina=1&limite=10">Ventas</Link>,
    icon: <ShoppingOutlined style={styleIcon} />
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
