import { IPaginationResponse } from "@/app/interfaces/pagination";
import useQueryParams from "@/hooks/use-query-params";
import { fetchAuth } from "@/app/lib/fetchAuth";
import * as dotEnv from "dotenv";
import { isEqual } from "@/app/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { IAction } from "@/app/(easycob)/interfaces/actions";
import { IQueryActionParams } from "../interfaces/action";
import { IQueryParams } from "@/app/interfaces/fetch";

dotEnv.config();

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const urn = "/v1/action";
const baseUrl = `${apiUrl}${urn}`;

const useActionsService = ({
  initialActions,
  initialQuery,
}: {
  initialActions: IPaginationResponse<IAction>;
  initialQuery: IQueryActionParams;
}) => {
  const { queryParams, setQueryParams } = useQueryParams(initialQuery);

  const [actions, setActions] = useState<IPaginationResponse<IAction> | null>(
    initialActions
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<IAction>>(baseUrl, {
        query: queryParams.current as IQueryParams,
      });
      if (result.success) {
        setActions(result.data);
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

  useEffect(() => {
    if (!isEqual(initialQuery, queryParams.current)) {
      fetchActions();
    }
  }, [queryParams]);

  return {
    actions,
    fetchActions,
    queryParams,
    setQueryParams,
    isLoading,
  };
};

export default useActionsService;
