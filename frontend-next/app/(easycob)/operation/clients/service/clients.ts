import { fetchAuth } from "@/app/lib/fetchAuth";
import { IMeta } from "@/app/interfaces/pagination";
import { IQueryClienteParams } from "../interfaces/cliente";
import { IClient } from "@/app/(easycob)/interfaces/clients";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/recovery/client";
const url = `${apiUrl}${urn}`;

export let query: IQueryClienteParams = {
  page: 1,
  perPage: 10,
  orderBy: "dtUpdate",
  descending: false,
  keywordColumn: "nomClien",
  status: "ATIVO",
};

// Função para atualizar `query`
export function setQuery(newParams: Partial<IQueryClienteParams>): void {
  query = { ...query, ...newParams };
}

export const fetchClients = async (): Promise<{
  data: IClient[];
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

export const fetchClient = async (
  codCredorDesRegis: String | Number
): Promise<IClient> => {
  const result = await fetchAuth(`${url}/${codCredorDesRegis}`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};
