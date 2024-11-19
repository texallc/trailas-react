import { Product } from "../../interfaces/models/product";
import HeaderView from "../../components/headerView";
import ModalForm from "../../components/modalForm";
import { useFormControl } from "../../context/formControl";
import { useEffect } from "react";
import { Get } from "../../interfaces";
import { useGetContext } from "../../context/getContext";
import { useSearchParams } from "react-router-dom";
import Table from "./table";

const Products = () => {
  const { response } = useGetContext<Get<Product>>();
  const { form, inputs } = useFormControl<Product>();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    const data = response?.list.find(p => p.id === +id);

    form?.setFieldValue("userIds", data?.inventories?.map(i => i.userId));
  }, [id, form, response, inputs]);

  return (
    <>
      <HeaderView />
      <Table />
      <ModalForm />
    </>
  );
};

export default Products;