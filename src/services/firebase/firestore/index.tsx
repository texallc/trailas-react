import { writeBatch, doc, collection as col, updateDoc } from "firebase/firestore";
import { db } from "..";

// Get a new write batch
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