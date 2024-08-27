
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { onSnapshot, getFirestore, QueryConstraint, Timestamp, collection as col, query as q, collection } from 'firebase/firestore';
import dayjs from "dayjs";
import { once } from "../utils/functions";

export interface PropsUseOnSnapshot {
  collection: string;
  query: QueryConstraint[];
  extraPropsByItemArray?: Record<string, any>;
  formatDate?: string;
  wait?: boolean;
  whitPropsDateFormated?: boolean;
}

interface Snapshot<T> {
  loading: boolean;
  data: Array<T>;
  setData: Dispatch<SetStateAction<Array<T>>>;
  setSnapshotProps: Dispatch<SetStateAction<PropsUseOnSnapshot>>;
  snapshotProps: PropsUseOnSnapshot;
}

const createSnapshotContext = once(<T extends {}>() => createContext({
  data: [],
  loading: true,
  setData: () => { },
  setSnapshotProps: () => { },
  snapshotProps: {
    collection: "",
    query: [],
  }
} as Snapshot<T>));

export const useOnSnapshot = <T extends {}>() => useContext(createSnapshotContext<T>());

const SnapshotProvider = <T extends {}>({ children }: { children: ReactNode; }) => {
  const Context = createSnapshotContext<T>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Array<T>>([]);
  const [snapshotProps, setSnapshotProps] = useState<PropsUseOnSnapshot>({
    collection: "",
    query: [],
  });

  const { collection, query, extraPropsByItemArray, formatDate, wait, whitPropsDateFormated } = snapshotProps;

  useEffect(() => {
    if (wait || !collection) return;

    setLoading(true);

    const uns = onSnapshot(q(col(getFirestore(), collection), ...query), (_snapshot) => {
      setData(
        _snapshot.docs.map(d => {
          let dataDoc = d.data();

          Object.keys(dataDoc).forEach(key => {
            if (dataDoc[key] instanceof Timestamp) {
              const date = dataDoc[key].toDate();
              dataDoc[key] = date;

              if (whitPropsDateFormated) {
                dataDoc[key + "Formated"] = dayjs(date).format(formatDate || "MM/DD/YYYY hh:mm a");
              }
            }
          });

          if (extraPropsByItemArray) {
            dataDoc = {
              ...dataDoc,
              ...extraPropsByItemArray
            };
          }

          return { ...dataDoc, id: d.id } as unknown as T;
        }) as Array<T>
      );

      setLoading(false);
    });

    return () => {
      uns();
      setData([]);
    };
  }, [collection, query, extraPropsByItemArray, formatDate, wait]);

  return <Context.Provider value={{ loading, data, setData, snapshotProps, setSnapshotProps }}>{children}</Context.Provider>;
};

export default SnapshotProvider;

