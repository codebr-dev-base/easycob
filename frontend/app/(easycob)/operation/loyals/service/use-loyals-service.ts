import { IPaginationResponse } from "@/app/interfaces/pagination";
import { ILoyal, IQueryLoyalParams } from "../interfaces/loyal";
import useQueryParams from "@/hooks/use-query-params";
import { fetchAuth } from "@/app/lib/fetchAuth";
import * as dotEnv from "dotenv";
import { isEqual } from "@/app/lib/utils";

dotEnv.config();

import { useCallback, useEffect, useRef, useState } from "react";
import { IQueryParams } from "@/app/interfaces/fetch";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const urn = "/v1/recovery/loyal";
const baseUrl = `${apiUrl}${urn}`;

const useLoyalsService = ({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<ILoyal>;
  initialQuery: IQueryLoyalParams;
}) => {
  const { queryParams, setQueryParams } = useQueryParams(initialQuery);

  const [loyals, setLoyals] = useState<IPaginationResponse<ILoyal> | null>(
    initialData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoyals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<ILoyal>>(baseUrl, {
        query: queryParams.current as IQueryParams,
      });
      if (result.success) {
        setLoyals(result.data);
      } else {
        setError(result.error || "Falha ao buscar usuários.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  // Chama `fetchUsers` sempre que `queryParams` mudar
  useEffect(() => {
    if (!isEqual(initialQuery, queryParams.current)) {
      fetchLoyals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loyals,
    setLoyals,
    isLoading,
    error,
    queryParams,
    fetchLoyals,
    setQueryParams,
  };
};

export default useLoyalsService;
