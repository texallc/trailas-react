import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Modal from "../modal";
import { useEffect, useMemo, useState } from "react";
import useGetSearchURL from "../../hooks/useGestSearchURL";
import FormControl from "../formControl";
import { useFormControl } from "../../context/formControl";
import { Form, message } from "antd";
import { post } from "../../services/http";
import useAbortController from "../../hooks/useAbortController";
import { useGetContext } from "../../context/getContext";
import { Get } from "../../interfaces";
import { RecursivePartial } from "../../types";

interface ModalFormProps<T> {
  urlProp?: string;
  urlCreate?: string;
  urlEdit?: string;
}

const ModalForm = <T extends { id: number; }>({ urlProp, urlCreate, urlEdit }: ModalFormProps<T>) => {
  const { response, setGetProps } = useGetContext<Get<T>>();
  const { inputs, onPopupScroll, onSearchSelect } = useFormControl();
  const abortController = useAbortController();
  const { url } = useGetSearchURL(urlProp);
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<T>();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");

    setOpen(Boolean(id));
    setId(id === null ? id : Number(id));

    if (!id) {
      form.resetFields();
      return;
    }

    const data = response?.list.find((item) => item.id === Number(id));

    if (!data) {
      form.resetFields();
      return;
    }

    form.setFieldsValue(data as RecursivePartial<T>);
  }, [searchParams, response]);

  const title = useMemo(() => {
    const moduleName = pathname.split("/")[1];
    const title = `${id ? "Editar" : "Crear"} ${moduleName.slice(0, -1)}`;

    return title;
  }, [pathname, id]);

  const onFinish = async (values: T) => {
    try {
      const { id } = values;
      let urlCreateOrEdit = urlCreate || urlEdit;
      let urlEndpoint = urlCreateOrEdit || `${pathname}/${id ? "update" : "create"}`;

      await post(urlEndpoint, values, abortController.current);

      setGetProps({ url: "" });

      setTimeout(() => {
        setGetProps({ url });
      }, 100);

      message.success("Registro guardado con exito!");

      handleClose();
    } catch (error) {
      console.log(error);
      message.error("Ocurrio un error al guardar el registro.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate(url.replace("/list", "").split("&id")[0]);
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      onOk={() => form.submit()}
    >
      <Form<T>
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        {
          inputs.map((input) => {
            return (
              <FormControl
                key={input.name}
                input={input}
                onPopupScroll={onPopupScroll}
                onSearchSelect={onSearchSelect}
              />
            );
          })
        }
      </Form>
    </Modal>
  );
};

export default ModalForm;