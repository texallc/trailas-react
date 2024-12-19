import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import useAbortController from '../hooks/useAbortController';
import { get } from "../services/http";
import { once } from "../utils/functions";

export interface PropsUseGet {
  url: string;
  wait?: boolean;
  mergeResponse?: boolean;
}

interface GetContext<T> {
  loading: boolean;
  response?: T;
  setResponse: Dispatch<SetStateAction<T | undefined>>;
  setGetProps: Dispatch<SetStateAction<PropsUseGet>>;
  getProps: PropsUseGet;
}

const createGetContext = once(<T extends {}>() => createContext({
  loading: true,
  response: undefined,
  setResponse: () => undefined,
  setGetProps: () => ({ url: "" }),
  getProps: {
    url: "",
  }
} as GetContext<T>));

export const useGetContext = <T extends {}>() => useContext(createGetContext<T>());

const GetProvider = <T extends {}>({ children }: { children: ReactNode; }) => {
  const Context = createGetContext<T>();
  const abortController = useAbortController();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<T>();
  const [localStateUrl, setLocalStateUrl] = useState("");
  const [getProps, setGetProps] = useState<PropsUseGet>({
    url: "",
  });
  const { url, wait, mergeResponse } = getProps;

  useEffect(() => {
    setLocalStateUrl(url);

    if (wait || !url || url === localStateUrl) return;

    const init = async () => {
      setLoading(true);

      try {
        const _response = await get<T>(url, abortController.current!);

        setResponse(r =>
          mergeResponse
            ? ({ list: [...(r as any)?.list || [], ...(_response as any)?.list], total: (_response as any)?.total }) as any as T
            : _response
        );
      } catch (error) {
        console.log(error);

        if (error instanceof Error) {
          message.error(error.message, 4);
          return;
        }

        if (typeof error === "string") {
          message.error(error, 4);
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [url, wait, mergeResponse, abortController, localStateUrl]);

  return <Context.Provider value={{ loading, response, setResponse, getProps, setGetProps }}>{children}</Context.Provider>;
};

export default GetProvider;
