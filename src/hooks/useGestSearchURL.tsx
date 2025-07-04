import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from "react-router-dom";

const useGetSearchURL = ({ urlProp, propsUrl, }: { urlProp?: string, propsUrl?: Record<string, string>; }) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    let _url = urlProp ? urlProp.split("?")[0] : `${pathname}/list`;

    for (const param of searchParams) {
      if (param[0] === "id") continue;

      if (!_url.includes("?")) {
        _url += `?${param[0]}=${param[1]}`;
        continue;
      };

      _url += `&${param[0]}=${param[1]}`;
    }

    for (const key in propsUrl) {
      const value = propsUrl[key];

      if (!_url.includes("?")) {
        _url += `?${key}=${value}`;
        continue;
      };

      _url += `&${key}=${value}`;
    }

    setUrl(_url);
  }, [searchParams, pathname, urlProp, propsUrl]);

  return ({ url });
};

export default useGetSearchURL;