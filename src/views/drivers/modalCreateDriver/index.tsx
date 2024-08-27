import { useEffect, useState } from "react";
import { Form, Input, message, ModalProps } from "antd";
import FormItem from "antd/es/form/FormItem";
import Modal from "../../../components/modal";
import { ruleEmail, ruleName, rulePhone } from "../../../constants";
import { create, findOneOrNull, update } from "../../../services/firebase/firestore";
import { or, where } from "firebase/firestore";

interface Props extends ModalProps {
  onClose: () => void;
  driver: Driver;
}

const ModalCreateDriver = ({ onClose, driver, ...props }: Props) => {
  const [form] = Form.useForm<Driver>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue(driver);
  }, [open, driver]);

  const saveDriver = async (driver: Driver) => {
    if (saving) return;

    try {
      const otherDriver = await findOneOrNull<Driver>("drivers", or(where('phone', '==', driver.phone), where('email', '==', driver.email)));

      if (otherDriver?.id !== driver.id && otherDriver?.phone === driver.phone) {
        message.error("El número de teléfono ya está registrado.", 4);
        return;
      }

      if (otherDriver?.id !== driver.id && otherDriver?.email === driver.email) {
        message.error("El correo electrónico ya está registrado.", 4);
        return;
      }

      setSaving(true);

      const id = driver.id;

      delete driver.id;

      if (typeof driver.age === "undefined") {
        delete driver.age;
      }

      if (id) {
        await update("drivers", id, { ...driver, updatedAt: new Date() });
      } else {
        await create("drivers", { ...driver, createdAt: new Date(), updatedAt: new Date() });
      }

      message.success("Chofer guardado correctamente.");

      handleClose();
    } catch (error) {
      console.log(error);
      message.error("Ocurrió un error al guardar el chofer.", 4);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      {...props}
      onCancel={handleClose}
      forceRender
      destroyOnClose
      onClose={handleClose}
      okButtonProps={{
        autoFocus: true,
        htmlType: 'submit',
        loading: saving
      }}
      modalRender={(children) => (
        <div>
          <Form
            layout="vertical"
            clearOnDestroy
            form={form}
            onFinish={saveDriver}
          >
            {children}
          </Form>
        </div>
      )}
    >
      <h3>{driver?.id ? "Editar chofer" : "Nuevo chofer"}</h3>
      <FormItem
        name="id"
        style={{ display: "none" }}
      >
        <Input />
      </FormItem>
      <FormItem
        label="Nombre"
        name="name"
        rules={[ruleName]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="Teléfono"
        name="phone"
        rules={[rulePhone]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="Correo electrónico"
        name="email"
        rules={[ruleEmail]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="Edad"
        name="age"
      >
        <Input type="number" />
      </FormItem>
    </Modal>
  );
};

export default ModalCreateDriver;