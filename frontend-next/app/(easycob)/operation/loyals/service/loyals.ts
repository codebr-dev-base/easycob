import { fetchAuth } from "@/app/lib/fetchAuth";
import { IMeta } from "@/app/interfaces/pagination";
import { ILoyal, IQueryLoyalParams } from "../interfaces/loyal";
import { IClient } from "@/app/(easycob)/interfaces/clients";
import { getUser } from "@/app/lib/auth";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/recovery/loyal";
const url = `${apiUrl}${urn}`;

export let query: IQueryLoyalParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  keywordColumn: "nomClien",
};

// Função para atualizar `query`
export function setQuery(newParams: Partial<IQueryLoyalParams>): void {
    query = { ...query, ...newParams };
  }

export const fetchLoyals = async (): Promise<{
  data: ILoyal[];
  meta: IMeta;
}> => {
  const result = await fetchAuth(url, {
    query,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchFaixaTempos = async (): Promise<{faixaTempo: string}[]> => {
  const result = await fetchAuth(`${url}/faixa/tempos`, {
    query,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchFaixaValores = async (): Promise<{faixaValor: string}[]> => {
  const result = await fetchAuth(`${url}/faixa/valores`, {
    query,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchFaixaTitulos = async (): Promise<{faixaTitulos: string}[]> => {
  const result = await fetchAuth(`${url}/faixa/titulos`, {
    query,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchFaixaClusters = async (): Promise<{classCluster: string}[]> => {
  const result = await fetchAuth(`${url}/faixa/clusters`, {
    query,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchUnidades = async (): Promise<{unidade: string}[]> => {
  const result = await fetchAuth(`${url}/unidades`, {
    query,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchSituacoes = async (): Promise<{classSitcontr: string}[]> => {
  const result = await fetchAuth(`${url}/situacoes`, {
    query,
  });

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
