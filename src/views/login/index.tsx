import { useState } from "react";
import { Button, Card, Form, Input, message } from "antd";
import styles from "./styles.module.css";
import useIsSmallScreen from "../../hooks/useIsSmallScreen";
import { useNavigate } from "react-router-dom";
import { signInWithEmail } from "../../services/firebase/auth";

interface User {
  email: string;
  password: string;
}

const Login = () => {
  const isSmallScreen = useIsSmallScreen();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: User) => {
    if (loading) return;

    setLoading(true);

    try {
      const { email, password } = values;
      await signInWithEmail(email, password);

      navigate("/inicio");
    } catch (error) {
      console.log(error);
      message.error("Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} style={{ marginTop: 30 }}>
      <Card className={styles.card} style={{ width: isSmallScreen ? 360 : 640 }}>
        <Card>
          <h2 style={{ color: "#304878" }}>Bienvenido</h2>
          <hr />
          <Form
            style={{ paddingTop: 10 }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<User>
              label="Correo"
              name="email"
              rules={[{ type: "email", required: true, message: "Correo válido requerido!" }]}
            >
              <Input autoComplete="email" />
            </Form.Item>
            <Form.Item<User>
              label="Contraseña"
              style={{ paddingTop: "10px" }}
              name="password"
              rules={[{ required: true, message: "Contraseña requerida!" }]}
            >
              <Input.Password autoComplete="current-password" />
            </Form.Item>
            <br />
            <Button htmlType="submit" type="primary" style={{ width: "100%" }} loading={loading}>Entrar</Button>
          </Form>
        </Card>
      </Card>
    </div>
  );
};

export default Login;