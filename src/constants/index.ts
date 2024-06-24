import { FormRule } from "antd";
import { TypeRute } from "../types";
import { Tires, TiresChangedByTraila, Traila } from "../interfaces/traila";


/* export const urlImageDefaultProfile = "https://firebasestorage.googleapis.com/v0/b/delivery-hmo.appspot.com/o/imagenesPerfil%2F1467646262_522853_1467646344_noticia_normal.jpg?alt=media&token=f6e761ad-95c5-462f-bc39-0e889ac30a5c";
export const baseUrlStorage = "https://firebasestorage.googleapis.com/v0/b/delivery-hmo.appspot.com/o/";
export const baseUrlStorageGCP = "https://storage.googleapis.com/delivery-hmo.appspot.com/images/";
 */
export const rulePhoneInput: FormRule = {
  required: true,
  message: 'El número telefónico tiene que ser de 10 dígitos.',
  validator: (rule, value?: string) => value?.length !== 10 ? Promise.reject(rule.message) : Promise.resolve(),
} as const;
export const ruleMaxLength: FormRule = {
  max: 300,
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
export const titleForm: Record<TypeRute, string> = {
  create: "Registrar",
  update: "Editar"
} as const;

export const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const nameTires = ["Llanta 1", "Llanta 2", "Llanta 3", "Llanta 4", "Llanta 5", "Llanta 6", "Llanta 7", "Llanta 8"];

export const initTires: Tires = {
  tire1: 0,
  tire2: 0,
  tire3: 0,
  tire4: 0,
  tire5: 0,
  tire6: 0,
  tire7: 0,
  tire8: 0,
};

export const initTraila: Traila = {
  name: "",
  category: "",
  tiresChanged: 0,
  orderImage: [],
  updatedAt: new Date(),
  createdAt: new Date(),
  createdBy: "",
  createdByEmail: "",
  ...initTires
};

export const initTiresChangedByTraila: TiresChangedByTraila = {
  idTraila: "",
  name: "",
  category: "",
  createdBy: "",
  createdByEmail: "",
  createdAt: new Date(),
  ...initTires,
};
