"use client";
import { useCallback, useState } from "react";
import { fetchAuth } from "@/app/lib/fetchAuth";
import * as dotEnv from "dotenv";
import { IFile, IQueryFileParams } from "../interfaces/files";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import useQueryParams from "@/hooks/use-query-params";
import { IQueryParams } from "@/app/interfaces/fetch";
import { de } from "date-fns/locale";

dotEnv.config();

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const urn = "/v1/external/file";
const baseUrl = `${apiUrl}${urn}`;

const useFilesService = ({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<IFile>;
  initialQuery: IQueryFileParams;
}) => {
  const { queryParams, setQueryParams } = useQueryParams(initialQuery);

  const [files, setFiles] = useState<IPaginationResponse<IFile>>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDetailsError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<IFile>>(baseUrl, {
        query: queryParams.current as IQueryParams,
      });
      if (result.success && result.data) {
        setFiles(result.data);
      } else {
        setError(result.error || "Falha ao buscar tags.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setDetailsError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await fetchAuth(baseUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (result.success) {
        setFiles((prevFiles) => ({
          ...prevFiles,
          data: [result.data, ...prevFiles.data],
        }));
      } else {
        console.log(result.error);
        setError(result.error || "Falha ao carregar arquivo.");
        setDetailsError(result.data || null);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Requisição cancelada pelo usuário.");
      } else {
        setError(`Ocorreu um erro inesperado. ${error}`);
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { files, setFiles, isLoading, error, detailsError, fetchFiles, uploadFile, setQueryParams, queryParams };
};

export default useFilesService;