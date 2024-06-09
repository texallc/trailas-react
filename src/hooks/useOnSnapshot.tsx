
import { useEffect, useState } from 'react';
import { onSnapshot, getFirestore, QueryConstraint, Timestamp, collection as col, query as q } from 'firebase/firestore';
import dayjs from "dayjs";

export interface PropsUseOnSnapshot {
  collection: string;
  query: QueryConstraint[];
  extraPropsByItemArray?: Record<string, any>;
  formatDate?: string;
  wait?: boolean;
  whitPropsDateFormated?: boolean;
}

const useOnSnapshot = <T extends {}>({ query, extraPropsByItemArray, formatDate, collection, wait, whitPropsDateFormated }: PropsUseOnSnapshot) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Array<T>>([]);

  useEffect(() => {
    let mounted = true;

    if (wait) return;

    const uns = onSnapshot(q(col(getFirestore(), collection), ...query), (_snapshot) => {
      if (!mounted) return;

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
      mounted = false;
      uns();
    };
  }, [collection, query, extraPropsByItemArray, formatDate, wait]);

  return { loading, data, setData };
};

export default useOnSnapshot;

