import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from "react-router-dom";

const useGetSearchURL = (urlProp?: string) => {
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

    setUrl(_url);
  }, [searchParams, pathname, urlProp]);

  return ({ url });
};

export default useGetSearchURL;