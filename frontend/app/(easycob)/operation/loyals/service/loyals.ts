import { fetchAuth } from "@/app/lib/fetchAuth";
import { IMeta } from "@/app/interfaces/pagination";
import { ILoyal, IQueryLoyalParams } from "../interfaces/loyal";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/recovery/loyal";
const url = `${apiUrl}${urn}`;

export const fetchLoyals = async (
  initialQuery: IQueryLoyalParams
): Promise<{
  data: ILoyal[];
  meta: IMeta;
}> => {
  const result = await fetchAuth(url, {
    query: initialQuery,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchFaixaTempos = async (): Promise<{ value: string }[]> => {
  const result = await fetchAuth(`${url}/faixa/tempos`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchFaixaValores = async (): Promise<{ value: string }[]> => {
  const result = await fetchAuth(`${url}/faixa/valores`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchFaixaTitulos = async (): Promise<{ value: string }[]> => {
  const result = await fetchAuth(`${url}/faixa/titulos`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchFaixaClusters = async (): Promise<{ value: string }[]> => {
  const result = await fetchAuth(`${url}/faixa/clusters`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchUnidades = async (): Promise<{ value: string }[]> => {
  const result = await fetchAuth(`${url}/unidades`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchSituacoes = async (): Promise<{ value: string }[]> => {
  const result = await fetchAuth(`${url}/situacoes`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const check = async (id: any) => {
  await fetchAuth(`${url}/check/${id}`);
};
