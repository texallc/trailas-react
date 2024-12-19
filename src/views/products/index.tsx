import { useMemo } from "react";
import { Product } from "../../interfaces/models/product";
import FormControlProvider from "../../context/formControl";
import { ruleName } from "../../constants";
import { useSearchParams } from "react-router-dom";
import { InputType } from "../../types/components/formControl";
import { useGetContext } from "../../context/getContext";
import { Get } from "../../interfaces";
import Products from "./products";
import { DefaultOptionType } from "antd/es/select";

const ProductsPage = () => {
  const { response } = useGetContext<Get<Product>>();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const inputs = useMemo(() => {
    const optionsBranchOffice: DefaultOptionType[] | undefined = id && id !== "0" ? response?.list.find(p => p.id === +id)?.inventories?.map((i) => ({
      value: i.userId,
      label: i.user?.name
    })) : undefined;

    const inputs: InputType<Product>[] = [
      {
        name: "id",
        style: { display: "none" },
      },
      {
        name: "name",
        label: "Nombre",
        rules: [ruleName],
        md: 12
      },
      {
        name: "categoryId",
        label: "Categoría",
        type: "select",
        url: "/categorias/list?pagina=1&limite=100",
        rules: [
          {
            required: true,
            message: "Por favor seleccione una categoría."
          }
        ],
        md: 12
      },
      {
        name: "partNumber",
        label: "Número de parte",
        rules: [
          {
            required: true,
            message: "Por favor ingrese el número de parte."
          }
        ],
        md: 12
      },
      {
        name: "price",
        label: "Precio",
        type: "price",
        md: 12
      },
      {
        name: "brand",
        label: "Marca",
        md: 12
      },
      {
        name: "unitType",
        label: "Tipo de unidad",
        type: "select",
        options: [
          {
            value: "Pieza",
            label: "Pieza"
          },
          {
            value: "Mililitros",
            label: "Mililitros"
          },
          {
            value: "Litros",
            label: "Litros"
          },
          {
            value: "Galon",
            label: "Galon"
          },
          {
            value: "Gramos",
            label: "Gramos"
          },
          {
            value: "Kilogramos",
            label: "Kilogramos"
          },
          {
            value: "Onzas",
            label: "Onzas"
          },
          {
            value: "Paquete",
            label: "Paquete"
          },
          {
            value: "Caja",
            label: "Caja"
          },
          {
            value: "Juego",
            label: "Juego"
          }
        ],
        md: 12
      },
      {
        name: "description",
        label: "Descripción",
        type: "textarea",
        md: 24
      },
      {
        name: "userIds",
        label: id === "0" ? "Agregar al inventario de una Sucursal" : "Sucursales en las que se encuentra",
        type: "select",
        url: "/usuarios/list?pagina=1&limite=10&role=Administrador de Sucursal",
        rules: [
          {
            required: true,
            message: "Por favor seleccione una sucursal."
          }
        ],
        options: optionsBranchOffice,
        mode: "multiple"
      },
    ];

    if (id === "0") {
      inputs.push(...
        [
          {
            name: "stock",
            label: "Stock",
            type: "number",
            min: 0,
            max: 999_999,
            showTag: true,
            tagProps: {
              color: "processing",
              children: "Nota: el stock aplica para todas las sucursales seleccionadas."
            }
          }
        ] as InputType<Product>[]
      );
    }

    if (id && id !== "0") {
      inputs.push({
        name: "active",
        label: "Activo",
        type: "switch",
      });
    }

    inputs.push({
      name: "image",
      label: "Imagen",
      type: "image",
      md: 24
    });

    return inputs;
  }, [id, response]);

  return (
    <FormControlProvider inputsProp={inputs}>
      <Products />
    </FormControlProvider>
  );
};

export default ProductsPage;