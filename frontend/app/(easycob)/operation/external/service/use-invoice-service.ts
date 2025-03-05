import { IPaginationResponse } from "@/app/interfaces/pagination";
import * as dotEnv from "dotenv";
import { useCallback, useState } from "react";
import useQueryParams from "@/hooks/use-query-params";
import { fetchAuth } from "@/app/lib/fetchAuth";
import { IInvoice } from "../interfaces/contracts";
import { IQueryPaginationParams } from "@/app/interfaces/pagination";

dotEnv.config();

const initialQuery: IQueryPaginationParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  keywordColumn: "nomCliente",
  status: "ativo",
};
const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const urn = "/v1/base/external/invoice";
const baseUrl = `${apiUrl}${urn}`;

const useInvoiceService = () => {
  const [invoices, setInvoices] = useState<IPaginationResponse<IInvoice> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { queryParams, setQueryParams } = useQueryParams(initialQuery);


  const fetchInvoices = useCallback(async (desContr: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<IInvoice>>(
        `${baseUrl}/${desContr}`
      );
      if (result.success && result.data) {
        setInvoices(result.data);
      } else {
        setError(result.error || "Falha ao buscar faturas.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    invoices,
    setInvoices,
    queryParams,
    setQueryParams,
    isLoading,
    error,
    fetchInvoices,
  };
};

export default useInvoiceService;
