import * as dotEnv from "dotenv";
import { useCallback, useEffect, useState } from "react";
import { fetchAuth } from "@/app/lib/fetchAuth";
import { IAction } from "../interfaces/actions";
import { toast } from "@/hooks/use-toast";

dotEnv.config();

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const urn = "/v1/base/external/action";
const baseUrl = `${apiUrl}${urn}`;

const useActionService = () => {
  const [actions, setActions] = useState<IAction[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorData, setErrorData] = useState<Record<string, any> | null>(null);

  const fetchActions = useCallback(async (desContr: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IAction[]>(
        `${baseUrl}/client/${desContr}`
      );
      if (result.success && result.data) {
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
  }, []);

  const createAction = async (data: IAction) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth(baseUrl, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (result.success && result.data) {
        console.log(result.data);
        setActions((prevActions) => [result.data, ...prevActions]);

        toast({
          title: "Sucesso",
          description: "Acionamento salvo com sucesso!",
          variant: "success",
        });
      } else {
        console.log(result);
        setError(result.error || "Falha ao salvar acionamento.");
        
        if (result.data) {
          setErrorData(result.data);
        }

        toast({
          title: "Erro",
          description: result.error || "Falha ao salvar acionamento.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {

      setIsLoading(false);
    }
  };

  return {
    actions,
    isLoading,
    error,
    errorData,
    fetchActions,
    createAction,
  };
};

export default useActionService;
