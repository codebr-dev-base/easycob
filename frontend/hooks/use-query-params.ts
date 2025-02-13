"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  buildQueryString,
  convertToRecord,
  parseStringToQuery,
} from "@/app/lib/params";
import { isEqual } from "@/app/lib/utils";

const useQueryParams = (initialParams: Record<string, unknown>) => {
  const queryParams = useRef<Record<string, unknown>>({ ...initialParams });

  const updateQueryParams = useCallback(() => {
    if (typeof window === "undefined") return;

    const queryString = buildQueryString(convertToRecord(queryParams.current));;

    // Se a queryString estiver vazia, não altera a URL
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    if (newUrl !== window.location.search) {
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.toString() === "") return;

    const query = parseStringToQuery(searchParams);

    if (!isEqual(queryParams.current, query)) {
      queryParams.current = { ...queryParams.current, ...query };
    }

    updateQueryParams(); // Atualiza a URL na primeira carga
  }, []);

  // Atualiza a URL quando queryParams muda
  useEffect(() => {
    updateQueryParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateQueryParams, queryParams.current]);

  const setQueryParams = (newParams: Record<string, unknown>) => {
    const updatedParams = { ...queryParams.current, ...newParams };

    if (!isEqual(queryParams.current, updatedParams)) {
      queryParams.current = updatedParams;
      updateQueryParams();
    }
  };

  return { queryParams, setQueryParams };
};

export default useQueryParams;
