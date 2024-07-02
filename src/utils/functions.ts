import { Modal, UploadFile, message } from "antd";
import { RcFile } from "antd/es/upload";
import { User, onIdTokenChanged, getAuth } from 'firebase/auth';
import { ReactNode } from "react";
import exceljs from "exceljs";
import { monthNames } from "../constants";
import { DownloadExcel } from "../interfaces/functions";

export const getCurrentToken = () => new Promise<string>((resolve, reject) => {
  const uns = onIdTokenChanged(
    getAuth(),
    async (user: User | null) => {
      uns();

      if (!user) {
        reject("Error de autenticación");
        return;
      }

      const token = await user.getIdToken();
      resolve(token);
    },
    () => reject("Error de autenticación")
  );
});

export const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

export const validFiles = (fileList: RcFile[], accept: string, showMessageError?: boolean) => {
  for (let index = 0; index < fileList.length; index++) {
    const file = fileList[index];
    const types = accept.split(",").map(type => type.trim()) || [];

    if (!types.includes(file.type!)) {
      if (showMessageError) {
        message.error(`Formato incorrecto.`, 4);
      }

      return false;
    }
  }

  return true;
};

export const onPreviewImage = async (file: UploadFile) => {
  let src = file.url as string;

  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsDataURL(file.originFileObj!);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve("");
    });

    if (!src) {
      message.error(`No se pudo obtener la imagen.`, 4);
      return;
    }
  }

  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};

export const setImagesToState = <T extends { image?: string | UploadFile[], images?: string[] | UploadFile[]; }>(state: T) => {
  const _state = { ...state };

  if (_state.image) {
    const url = _state.image as string;

    const imageUploadFile: UploadFile = {
      name: url,
      uid: url,
      thumbUrl: url,
      url,
      status: "done"
    };

    _state.image = [imageUploadFile];
  }

  if (_state.images?.length) {
    _state.images = _state.images.map(url => {
      url = url as string;

      const imageUploadFile: UploadFile = {
        name: url,
        uid: url,
        thumbUrl: url,
        url,
        status: "done"
      };

      return imageUploadFile;
    });
  }

  return _state;
};

export const fileToBase64 = (file: File) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

export const handleError = (error: any) => {
  console.log(error);

  if (error instanceof Error) {
    throw new Error(error.message);
  }

  throw new Error(error as string);
};

export const confirmDialog = <T>(content: ReactNode, fun: () => Promise<T>, textSuccess?: string) =>
  new Promise<T>((resolve, reject) => Modal.confirm({
    title: `Espera!`,
    content,
    okText: 'Aceptar',
    cancelText: 'Cancelar',
    onOk: async () => {
      try {
        const res = await fun();

        if (textSuccess) {
          message.success(textSuccess);
        }

        resolve(res);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    },
    onCancel: () => {
      resolve(false as T);
    }
  }));

export const getWorkbookFromFile = (file: File) => new Promise<exceljs.Workbook>((resolve, reject) => {
  const reader = new FileReader();

  reader.readAsArrayBuffer(file);

  reader.onload = async () => {
    let workbook = new exceljs.Workbook();
    workbook = await workbook.xlsx.load(reader.result as ArrayBuffer);
    resolve(workbook);
  };

  reader.onerror = () => reject("Error al obtener Workbook.");
});


export const getMonthLabels = () => {
  const now = new Date();
  const mont = now.getMonth();

  return monthNames.slice(0, mont + 1);;
};

export const generateRandomColorWithBaseTone = (): string => {
  const baseR = 53;
  const baseG = 162;
  const baseB = 235;
  const alpha = 0.5;

  const adjustValue = (base: number, range: number): number => {
    const variation = Math.floor(Math.random() * (2 * range + 1)) - range;
    return Math.min(255, Math.max(0, base + variation));
  };

  const range = 30; // You can adjust the range of variation as needed

  const r = adjustValue(baseR, range);
  const g = adjustValue(baseG, range);
  const b = adjustValue(baseB, range);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getArrayChunk = <T>(array: Array<T>, size: number) => Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
  array.slice(i * size, i * size + size)
);

export const deleteUndefinedProperties = <T extends {}>(obj: T) => {
  Object.keys(obj).forEach(key => {
    const k = key as keyof T;

    if (obj[k] === undefined) {
      delete obj[k];
    }
  });

  return obj;
};

export const downLoadExcel = async ({ fileName, nameWorksheet, columns, data }: DownloadExcel) => {
  try {
    const workbook = new exceljs.Workbook();

    const worksheet = workbook.addWorksheet(nameWorksheet);
    worksheet.columns = columns;
    worksheet.addRows(data);

    const buffer = await workbook.xlsx.writeBuffer();
    const url = window.URL.createObjectURL(new Blob([buffer]));
    const a = document.createElement("a");

    a.href = url;
    a.setAttribute("download", `${fileName}.xlsx`);
    a.click();
    a.remove();
  } catch (error) {
    message.error("Error al descargar el Excel");
    throw handleError(error);
  }
};