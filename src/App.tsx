import MyRouter from './router';
import { AuthProvider } from './context/authContext';
import { ConfigProvider } from "antd";
import locale from 'antd/locale/es_ES';

const App = () => {
  return (
    <ConfigProvider locale={locale}>
      <AuthProvider>
        <MyRouter />
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
