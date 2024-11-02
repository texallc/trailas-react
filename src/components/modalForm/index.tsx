import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Modal from "../modal";
import { useEffect, useMemo, useState } from "react";
import useGetSearchURL from "../../hooks/useGestSearchURL";

interface ModalFormProps {
  urlProp?: string;
}

const ModalForm = ({ urlProp }: ModalFormProps) => {
  const { url } = useGetSearchURL(urlProp);
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");

    setOpen(Boolean(id));
    setId(id === null ? id : Number(id));
  }, [searchParams]);

  const title = useMemo(() => {
    const moduleName = pathname.split("/")[1];
    const title = `${id ? "Editar" : "Crear"} ${moduleName}`;

    return title;
  }, [pathname, id]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={() => {
        setOpen(false);
        navigate(url.replace("/list", "").split("&id")[0]);
      }}
    />
  );
};

export default ModalForm;