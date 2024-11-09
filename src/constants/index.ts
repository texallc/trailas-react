import { FormRule } from "antd";
import { TypeRoute } from "../types";
import { SizeTires, SizeTiresUpload, Tires, TiresChangedByTraila, Traila } from "../interfaces/traila";
import { SizesTires } from "../types/traila";
import { Column } from "exceljs";

/* export const urlImageDefaultProfile = "https://firebasestorage.googleapis.com/v0/b/delivery-hmo.appspot.com/o/imagenesPerfil%2F1467646262_522853_1467646344_noticia_normal.jpg?alt=media&token=f6e761ad-95c5-462f-bc39-0e889ac30a5c";
export const baseUrlStorage = "https://firebasestorage.googleapis.com/v0/b/delivery-hmo.appspot.com/o/";
export const baseUrlStorageGCP = "https://storage.googleapis.com/delivery-hmo.appspot.com/images/";
 */

export const ruleName: FormRule = {
  required: true,
  message: 'El nombre es requerido.',
  validator: (rule, value?: string) => {
    return !value?.length ? Promise.reject(rule.message) : Promise.resolve();
  },
} as const;

export const rulePhone: FormRule = {
  required: true,
  message: 'El número telefónico tiene que ser de 10 dígitos.',
  validator: (rule, value?: string) => value?.length !== 10 ? Promise.reject(rule.message) : Promise.resolve(),
} as const;

export const rulePrice: FormRule = {
  required: true,
  message: 'El precio no puede ser menor a 1 o mayor a 999,999.',
  validator: (rule, value?: string) => {
    if (!value) return Promise.reject(rule.message);

    const numberValue = +value;

    if (numberValue < 1 || numberValue > 999999) return Promise.reject(rule.message);

    return Promise.resolve();
  },
} as const;

export const ruleMaxLength: FormRule = {
  max: 255,
  message: "El texto no puede tener más de 300 caracteres.",
  type: "string"
} as const;

export const ruleLargeMaxLength: FormRule = {
  max: 3000,
  message: "El texto no puede tener más de 300 caracteres."
} as const;

export const ruleEmail: FormRule = {
  required: true,
  message: 'Favor de escribir un correo electrónico válido.',
  type: "email"
} as const;

export const rulePassword: FormRule = {
  required: true,
  min: 6,
  message: 'La contraseña tiene que ser de 6 dígitos o más.'
} as const;

export const titleForm: Record<TypeRoute, string> = {
  create: "Registrar",
  update: "Editar"
} as const;

export const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const nameTires = ["Llanta 1", "Llanta 2", "Llanta 3", "Llanta 4", "Llanta 5", "Llanta 6", "Llanta 7", "Llanta 8"];

export const sizeTires = ["8/32", "9/32", "10/32", "11/32", "12/32", "13/32", "14/32", "15/32", "16/32", "17/32", "18/32", "19/32", "20/32", "21/32", "22/32", "23/32", "24/32", "25/32", "26/32"];

export const initTires: Tires = {
  tire1: 0,
  tire2: 0,
  tire3: 0,
  tire4: 0,
  tire5: 0,
  tire6: 0,
  tire7: 0,
  tire8: 0,
} as const;

export const initSizeTires: SizeTires = {
  sizeTire1: undefined,
  sizeTire2: undefined,
  sizeTire3: undefined,
  sizeTire4: undefined,
  sizeTire5: undefined,
  sizeTire6: undefined,
  sizeTire7: undefined,
  sizeTire8: undefined,
} as const;


export const initSizeTiresUpload: SizeTiresUpload = {
  sizeTire1: "",
  sizeTire2: "",
  sizeTire3: "",
  sizeTire4: "",
  sizeTire5: "",
  sizeTire6: "",
  sizeTire7: "",
  sizeTire8: "",
} as const;

export const initTraila: Traila = {
  name: "",
  category: "",
  tiresChanged: 0,
  updatedAt: new Date(),
  createdAt: new Date(),
  createdBy: "",
  createdByEmail: "",
  driver: "",
  ...initTires
} as const;

export const initTiresChangedByTraila: TiresChangedByTraila = {
  idTraila: "",
  name: "",
  category: "",
  createdBy: "",
  createdByEmail: "",
  repairOrders: [],
  ...initTires,
  ...initSizeTires
} as const;

export const initDriver: Driver = {
  id: "",
  name: "",
  phone: "",
  email: "",
  age: undefined,
  createdBy: "",
  createdByEmail: "",
} as const;

export const sideTiresUploadChange: Record<string, keyof Tires> = {
  "EJE 1 A_ Chofer": "tire1",
  "EJE 1 _B Chofer": "tire2",
  "EJE 1 _B Pasajero": "tire3",
  "EJE 1 A_ Pasajero": "tire4",
  "EJE 2 A_ Chofer": "tire5",
  "EJE 2 _B Chofer": "tire6",
  "EJE 2 _B Pasajero": "tire7",
  "EJE 2 A_ Pasajero": "tire8",
} as const;

export const dataSizesTire: SizesTires[] = ["255/70 R 22.5", "275/70 R 22.5"];

export const columnsExcelTrailas: Partial<Column>[] = [
  {
    header: "Nombre",
    key: "name",
    width: 32
  },
  {
    header: "Categoría",
    key: "category",
    width: 32
  },
  {
    header: "Creado por",
    key: "createdByEmail",
    width: 32
  },
  {
    header: "Fecha de creación",
    key: "createdAtFormated",
    width: 32
  },
  {
    header: "Fecha de modificación",
    key: "updatedAtFormated",
    width: 32
  },
  {
    header: "LLantas cambiadas",
    key: "tiresChanged",
    width: 32
  }
];