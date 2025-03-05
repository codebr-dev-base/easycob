import { IPaginationResponse } from "@/app/interfaces/pagination";
import * as dotEnv from "dotenv";
import { use, useCallback, useEffect, useState } from "react";
import { IContract, IQueryContractParams } from "../interfaces/contracts";
import useQueryParams from "@/hooks/use-query-params";
import { fetchAuth } from "@/app/lib/fetchAuth";
import { IQueryParams } from "@/app/interfaces/fetch";
import { isEqual } from "@/app/lib/utils";

dotEnv.config();

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

  const urn = "/v1/base/external/contract";
  const baseUrl = `${apiUrl}${urn}`;

const useContractService = ({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<IContract>;
  initialQuery: IQueryContractParams;
}) => {
  const { queryParams, setQueryParams } = useQueryParams(initialQuery);
  const [contracts, setContracts] =
    useState<IPaginationResponse<IContract>>(initialData);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<IContract>>(baseUrl, {
        query: queryParams.current as IQueryParams,
      });
      if (result.success && result.data) {
        setContracts(result.data);
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
      fetchContracts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    contracts,
    isLoading,
    error,
    queryParams,
    fetchContracts,
    setQueryParams,
  };
};

export default useContractService;
