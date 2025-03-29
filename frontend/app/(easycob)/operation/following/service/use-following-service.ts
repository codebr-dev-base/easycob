import { IPaginationResponse } from "@/app/interfaces/pagination";
import useQueryParams from "@/hooks/use-query-params";
import { fetchAuth } from "@/app/lib/fetchAuth";
import * as dotEnv from "dotenv";
import { isEqual } from "@/app/lib/utils";

dotEnv.config();

import { useCallback, useEffect, useRef, useState } from "react";
import { IQueryParams } from "@/app/interfaces/fetch";
import { IQueryFollowingParams } from "../interfaces/following";
import {
  INegotiationInvoice,
  INegotiationOfPayment,
  IPromiseOfPayment,
} from "@/app/(easycob)/interfaces/actions";
import { se } from "date-fns/locale";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const urn = "/v1/action";
const baseUrl = `${apiUrl}${urn}`;

const useFlouwingsService = ({
  initialQuery,
}: {
  initialQuery: IQueryFollowingParams;
}) => {
  const { queryParams, setQueryParams } = useQueryParams(initialQuery);

  const [negotiations, setNegotiations] =
    useState<IPaginationResponse<INegotiationOfPayment> | null>(null);

  const [agreements, setAgreements] =
    useState<IPaginationResponse<IPromiseOfPayment> | null>(null);

  const [invoices, setInvoices] =
    useState<IPaginationResponse<INegotiationInvoice> | null>(null);

  const [promises, setPromises] =
    useState<IPaginationResponse<IPromiseOfPayment> | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNegotiations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<
        IPaginationResponse<INegotiationOfPayment>
      >(`${baseUrl}/negotiation`, {
        query: queryParams.current as IQueryParams,
      });
      if (result.success) {
        setNegotiations(result.data);
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

  const fetchAgreements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<IPromiseOfPayment>>(
        `${baseUrl}/promise`,
        {
          query: { ...(queryParams.current as IQueryParams), typeActionIds: 1 },
        }
      );
      if (result.success) {
        setAgreements(result.data);
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

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<INegotiationInvoice>>(
        `${baseUrl}/negotiation/invoice`,
        {
          query: queryParams.current as IQueryParams,
        }
      );
      if (result.success) {
        setInvoices(result.data);
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

  const fetchPromises = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<IPromiseOfPayment>>(
        `${baseUrl}/promise`,
        {
          query: { ...(queryParams.current as IQueryParams), typeActionIds: 2 },
        }
      );
      if (result.success) {
        setPromises(result.data);
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
      fetchNegotiations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    negotiations,
    setNegotiations,
    agreements,
    setAgreements,
    invoices,
    setInvoices,
    promises,
    setPromises,
    isLoading,
    error,
    queryParams,
    setQueryParams,
    fetchNegotiations,
    fetchAgreements,
    fetchInvoices,
    fetchPromises,
  };
};

export default useFlouwingsService;
