import { useEffect, useContext, createContext, ReactNode, useState, UIEvent } from "react";
import { InputType } from "../../types/components/formControl";
import { ItemSelect, SelectGet } from "../../interfaces/components/formControl";
import { message } from "antd";
import useAbortController from "../../hooks/useAbortController";
import { get } from "../../services/http";
import { once } from "../../utils/functions";

interface Props<T> {
  children: ReactNode;
  itemsProp: InputType<T>[];
}

type OnPopupScrollFun<T> = (e: UIEvent<HTMLDivElement, globalThis.UIEvent>, item: ItemSelect<keyof T>) => Promise<void>;

interface Context<T> {
  items: InputType<T>[];
  onPopupScroll: OnPopupScrollFun<T>;
  onSearchSelect: (search: string) => void;
}

const createStateContext = once(<T extends {}>() => createContext({
  items: [],
  onPopupScroll: () => Promise.resolve(),
  onSearchSelect: (_: string) => { }
} as Context<T>));

export const useFormControl = <T extends {}>() => useContext(createStateContext<T>());

const FormControlProvider = <T extends {}>({ children, itemsProp }: Props<T>) => {
  const Context = createStateContext<T>();
  const abortController = useAbortController();
  const [items, setItems] = useState<InputType<T>[]>([]);
  const [notLoadMore, setNotLoadMore] = useState(false);

  useEffect(() => {
    if (!itemsProp.length || items.length) return;

    const init = async () => {
      try {
        const newItems = await Promise.all(itemsProp.map(async item => {
          if (item.type !== "select" || !item.url) return item;

          const response = await get<SelectGet>(item.url, abortController.current);

          item.loading = false;
          item.page = 1;
          item.options = response.list.map((r) => ({ value: r.id, label: `${r.name || ""} ${r.email ? " - " + r.email : ""}` }));

          return item;
        }));

        setItems(newItems);
      } catch (error) {
        console.log(error);
        message.error("Error al obtener los filtros de listas.");
      }
    };

    init();
  }, [itemsProp, abortController, items, message]);

  const onPopupScroll = async (e: UIEvent<HTMLDivElement, globalThis.UIEvent>, item: ItemSelect<keyof T>) => {
    if (notLoadMore) return;

    const selectItems = items.filter(i => i.type === "select") as ItemSelect<keyof T>[];

    if (selectItems.some(i => i.loading)) return;

    const target = e.target as HTMLDivElement;
    const { url, page } = item;

    if (target.scrollTop + target.offsetHeight !== target.scrollHeight) return;

    setItems(prev => prev.map(i => {
      const parseItem = i as ItemSelect<keyof T>;

      if (parseItem.id !== item.id) return parseItem;

      parseItem.loading = true;

      return parseItem;
    }));

    try {
      const response = await get<SelectGet>(`${url}?page=${page! + 1}`, abortController.current);

      if (response.list.length !== 10) {
        setNotLoadMore(true);
      }

      setItems(items.map(i => {
        const parseItem = i as ItemSelect<keyof T>;

        if (parseItem.id !== item.id) return parseItem;

        parseItem.options = [...parseItem.options || [], ...response.list.map((r) => ({ value: r.id, label: `${r.name || ""} ${r.email ? " - " + r.email : ""}` }))];
        parseItem.page = page! + 1;

        return parseItem;
      }));
    } catch (error) {
      console.log(error);
      message.error("Error al obtener más resultados.");
    } finally {
      setItems(prev => prev.map(i => {
        const parseItem = i as ItemSelect<keyof T>;

        if (parseItem.id !== item.id) return parseItem;

        parseItem.loading = false;

        return parseItem;
      }));
    }
  };

  const onSearchSelect = async (search: string) => {
    console.log("searchValue ---->", search);
  };

  return <Context.Provider value={{ items, onPopupScroll, onSearchSelect }}>{children}</Context.Provider>;
};

export default FormControlProvider;
