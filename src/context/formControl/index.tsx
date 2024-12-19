import { useEffect, useContext, createContext, ReactNode, useState, UIEvent, useCallback, Dispatch, SetStateAction } from "react";
import { InputType } from "../../types/components/formControl";
import { ItemSelect, SelectGet } from "../../interfaces/components/formControl";
import { Form, FormInstance, message } from "antd";
import useAbortController from "../../hooks/useAbortController";
import { get } from "../../services/http";
import { once } from "../../utils/functions";

interface Props<T> {
  children: ReactNode;
  inputsProp?: InputType<T>[];
  isFiltersTable?: boolean;
}

type OnPopupScrollFun<T> = (e: UIEvent<HTMLDivElement, globalThis.UIEvent>, item: ItemSelect<keyof T>) => Promise<void>;

interface Context<T> {
  inputs: InputType<T>[];
  onPopupScroll: OnPopupScrollFun<T>;
  onSearchSelect: (search: string) => void;
  form: FormInstance<T>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const createStateContext = once(<T extends {}>() => createContext({
  inputs: [],
  onPopupScroll: () => Promise.resolve(),
  onSearchSelect: (_: string) => { },
  form: {} as FormInstance<T>,
  open: false,
  setOpen: () => false
} as Context<T>));

export const useFormControl = <T extends {}>() => useContext(createStateContext<T>());

const FormControlProvider = <T extends {}>({ children, inputsProp, isFiltersTable }: Props<T>) => {
  const [form] = Form.useForm<T>();
  const Context = createStateContext<T>();
  const abortController = useAbortController();
  const [inputs, setInputs] = useState<InputType<T>[]>([]);
  const [notLoadMore, setNotLoadMore] = useState(false);
  const [filtersTabledLoaded, setFiltersTabledLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  const init = useCallback(async () => {
    if (!inputsProp?.length || inputsProp.some(i => i.type === "select" && i.loading)) return;

    try {
      setNotLoadMore(false);

      const newItems = await Promise.all(inputsProp!.map(async input => {
        if (input.type !== "select" || !input.url) return input;

        const response = await get<SelectGet>(input.url, abortController.current);

        input.loading = false;
        input.page = 1;
        input.options = response.list.map((r) => ({ value: r.id, label: `${r.name || ""} ${r.email ? " - " + r.email : ""}` }));

        return input;
      }));

      setInputs(newItems);
    } catch (error) {
      console.log(error);
      message.error("Error al obtener los filtros de listas.");
    }
  }, [inputsProp, abortController]);

  useEffect(() => {
    if (!isFiltersTable || filtersTabledLoaded) return;

    init();
    setFiltersTabledLoaded(true);
  }, [init, isFiltersTable, filtersTabledLoaded]);

  useEffect(() => {
    if (!open) return;

    init();
  }, [open]);

  const onPopupScroll = async (e: UIEvent<HTMLDivElement, globalThis.UIEvent>, item: ItemSelect<keyof T>) => {
    if (notLoadMore) return;

    const selectItems = inputs.filter(i => i.type === "select") as ItemSelect<keyof T>[];

    if (selectItems.some(i => i.loading)) return;

    const target = e.target as HTMLDivElement;
    const { url, page } = item;

    if (target.scrollTop + target.offsetHeight !== target.scrollHeight) return;

    setInputs(prev => prev.map(i => {
      const parseItem = i as ItemSelect<keyof T>;

      if (parseItem.id !== item.id) return parseItem;

      parseItem.loading = true;

      return parseItem;
    }));

    try {
      const path = url?.split("?")[0];
      const response = await get<SelectGet>(`${path}?pagina=${page! + 1}&limite=10`, abortController.current);

      if (response.list.length !== 10) {
        setNotLoadMore(true);
      }

      setInputs(inputs.map(i => {
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
      setInputs(prev => prev.map(i => {
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

  return <Context.Provider value={{ inputs, onPopupScroll, onSearchSelect, form, open, setOpen }}>{children}</Context.Provider>;
};

export default FormControlProvider;
