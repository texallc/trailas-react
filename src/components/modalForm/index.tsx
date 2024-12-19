import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Modal from "../modal";
import useGetSearchURL from "../../hooks/useGestSearchURL";
import FormControl from "../formControl";
import { useFormControl } from "../../context/formControl";
import { post, put } from "../../services/http";
import { Col, Form, message, Row, Tag, UploadFile } from "antd";
import useAbortController from "../../hooks/useAbortController";
import { useGetContext } from "../../context/getContext";
import { Get } from "../../interfaces";
import { RecursivePartial } from "../../types";

interface ModalFormProps {
  urlProp?: string;
  urlCreate?: string;
  urlEdit?: string;
}

const ModalForm = <T extends { id: number; image?: string; }>({ urlProp, urlCreate, urlEdit }: ModalFormProps) => {
  const { response, setGetProps } = useGetContext<Get<T>>();
  const { inputs, onPopupScroll, onSearchSelect, form, open, setOpen } = useFormControl<T>();
  const abortController = useAbortController();
  const { url } = useGetSearchURL({ urlProp });
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [id, setId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [fileListImage, setFileListImage] = useState<UploadFile[]>([]);

  useEffect(() => {
    const id = searchParams.get("id");

    setOpen(Boolean(id));
    setId(id === null ? id : Number(id));

    if (!id) {
      setFileListImage?.([]);
      form.resetFields();
      return;
    }

    const data = response?.list.find((item) => item.id === Number(id));

    if (!data) {
      form.resetFields();
      return;
    }

    if (data.image) {
      const url = data.image;

      const imageUploadFile: UploadFile = {
        name: url,
        uid: url,
        url,
        status: "done"
      };

      setFileListImage?.([imageUploadFile]);
    }

    form.setFieldsValue(data as RecursivePartial<T>);
  }, [searchParams, response, form, setFileListImage, setOpen]);

  const title = useMemo(() => {
    const moduleName = pathname.split("/")[1];
    const title = `${id ? "Editar" : "Crear"} ${moduleName.slice(0, -1)}`;

    return title;
  }, [pathname, id]);

  const onFinish = async (values: T) => {
    const { password, confirmPassword } = values as T & { password?: string; confirmPassword?: string; };

    if (password && confirmPassword && password !== confirmPassword) {
      message.error("Error, Las contraseñas no coinciden.");
      return;
    }

    setSaving(true);

    const urlImgOrBase64 = fileListImage?.length ? fileListImage?.map(i => i.thumbUrl || "")[0] : "";

    if (urlImgOrBase64) {
      values = { ...values, image: urlImgOrBase64 };
    } else {
      delete values.image;
    }

    const { id } = values;
    let urlCreateOrEdit = urlCreate || urlEdit;
    let urlEndpoint = urlCreateOrEdit || `${pathname}/${id ? "update" : "create"}`;

    try {
      id ? await put(urlEndpoint, values, abortController.current)
        : await post(urlEndpoint, values, abortController.current);

      setGetProps({ url: "" });

      setTimeout(() => {
        setGetProps({ url });
      }, 100);

      message.success("Registro guardado con exito!");

      handleClose();
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        message.error(error.message);
        return;
      }

      message.error("Ocurrio un error al guardar el registro.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate(url.replace("/list", "").split("&id")[0]);
  };

  return (
    <Modal
      width={1000}
      title={title}
      open={open}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{
        loading: saving,
        disabled: saving
      }}
    >
      <Form<T>
        form={form}
        onError={(error) => {
          console.log(error);
        }}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Row justify="center" align="middle" gutter={20}>
          {
            inputs.map((input) => {
              return (
                ["id", "uid"].includes(input.name.toString())
                  ?
                  <FormControl
                    key={input.name.toString()}
                    input={input}
                    onPopupScroll={onPopupScroll}
                    onSearchSelect={onSearchSelect}
                  />
                  :
                  <Col xs={24} md={input.md || 12} key={input.name.toString()}>
                    <div style={input.showTag ? { paddingTop: 22 } : undefined}>
                      <FormControl
                        input={input}
                        onPopupScroll={onPopupScroll}
                        onSearchSelect={onSearchSelect}
                        fileListImage={fileListImage}
                        setFileListImage={setFileListImage}
                      />
                    </div>
                    {input.showTag && <Tag {...input.tagProps} />}
                  </Col>
              );
            })
          }
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalForm;