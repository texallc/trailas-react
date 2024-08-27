import { writeBatch, doc, collection, updateDoc, addDoc, deleteDoc, QueryConstraint, getDocs, query, QueryCompositeFilterConstraint } from "firebase/firestore";
import { db } from "..";
import { RcFile } from "antd/es/upload";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

export const create = (path: string, data: Record<string, any>) => addDoc(collection(db, path), data);

export const update = (path: string, id: string, data: Record<string, any>) =>
  updateDoc(doc(db, path, id), data);

export const delDoc = (path: string, id: string) => deleteDoc(doc(db, path, id));

export const getCollectionDocs = (path: string, _query: QueryConstraint[] | QueryCompositeFilterConstraint) => {
  const ref = collection(db, path);

  if (Array.isArray(_query)) {
    return getDocs(query(ref, ..._query));

  }

  return getDocs(query(ref, _query));
};

export const bulkCreate = (path: string, data: Record<string, any>[]) => {
  const batch = writeBatch(db);

  data.forEach(d => {
    const ref = doc(collection(db, path));

    batch.set(ref, d);
  });

  return batch.commit();
};

export const bulkUpdate = (path: string, data: Record<string, any>[]) => {
  const batch = writeBatch(db);

  data.forEach(d => {
    const id = d.id as string;
    const ref = doc(db, path, id);

    batch.update(ref, d);
  });

  return batch.commit();
};

export const uploadFiles = async (path: string, files: RcFile[]) => {
  const uploadResults = await Promise.all(files.map(file => {
    const url = path + "/" + new Date().toString() + " - " + file.name;
    const storageRef = ref(storage, url);

    return uploadBytes(storageRef, file);
  }));

  const urls = await Promise.all(uploadResults.map(result => getDownloadURL(result.ref)));

  return urls;
};

export const findOneOrNull = async <T extends {}>(path: string, _query: QueryConstraint[] | QueryCompositeFilterConstraint) => {
  const docs = await getCollectionDocs(path, _query);

  return docs.size > 0 ? { ...docs.docs[0].data(), id: docs.docs[0].id } as unknown as T : null;
};