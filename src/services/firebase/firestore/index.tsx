import { writeBatch, doc, collection as col, updateDoc, addDoc, runTransaction } from "firebase/firestore";
import { db } from "..";

export const create = (collection: string, data: Record<string, any>) => addDoc(col(db, collection), data);

export const update = (collection: string, id: string, data: Record<string, any>) =>
  updateDoc(doc(db, collection, id), data);

export const bulkCreate = (collection: string, data: Record<string, any>[]) => {
  const batch = writeBatch(db);

  data.forEach(d => {
    const ref = doc(col(db, collection));

    console.log(ref);
    batch.set(ref, d);
  });

  return batch.commit();
};