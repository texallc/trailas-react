import { writeBatch, doc, collection as col, updateDoc, addDoc, runTransaction, collection, QueryConstraint, getDocs, query } from "firebase/firestore";
import { db } from "..";
import { RcFile } from "antd/es/upload";
import { message } from "antd";
import { handleError } from "../../../utils/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

export const create = (collection: string, data: Record<string, any>) => addDoc(col(db, collection), data);

export const update = (collection: string, id: string, data: Record<string, any>) =>
  updateDoc(doc(db, collection, id), data);

export const getCollectionDocs = (path: string, _query: QueryConstraint[]) => getDocs(query(collection(db, path), ..._query));

export const bulkCreate = (collection: string, data: Record<string, any>[]) => {
  const batch = writeBatch(db);

  data.forEach(d => {
    const ref = doc(col(db, collection));

    batch.set(ref, d);
  });

  return batch.commit();
};

export const bulkUpdate = (collection: string, data: Record<string, any>[]) => {
  const batch = writeBatch(db);

  data.forEach(d => {
    const id = d.id as string;
    const ref = doc(db, collection, id);

    batch.update(ref, d);
  });

  return batch.commit();
};


export const uploadFiles = async (path: string, files: RcFile[]) => {
  try {
    const uploadResults = await Promise.all(files.map(file => {
      const url = path + "/" + new Date().toString() + " - " + file.name;
      const storageRef = ref(storage, url);

      return uploadBytes(storageRef, file);
    }));

    const urls = await Promise.all(uploadResults.map(result => getDownloadURL(result.ref)));

    return urls;
  } catch (error) {
    message.error("Ocurrio un error al subir algun archivo");
    throw handleError(error);
  }
};