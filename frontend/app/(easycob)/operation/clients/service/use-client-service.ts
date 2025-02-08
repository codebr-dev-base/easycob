import { IPaginationResponse } from "@/app/interfaces/pagination";
import { IQueryClienteParams } from "../interfaces/cliente";
import { IClient } from "@/app/(easycob)/interfaces/clients";
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

const urn = "/v1/recovery/client";
const baseUrl = `${apiUrl}${urn}`;

const useClientsService = ({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<IClient>;
  initialQuery: IQueryClienteParams;
}) => {
  const { queryParams, setQueryParams } = useQueryParams(initialQuery);

  const [clients, setClients] = useState<IPaginationResponse<IClient> | null>(
    initialData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<IClient>>(baseUrl, {
        query: queryParams.current as IQueryParams,
      });
      if (result.success) {
        setClients(result.data);
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
      fetchClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    clients,
    isLoading,
    error,
    queryParams,
    fetchClients,
    setQueryParams,
  };
};

export default useClientsService;
