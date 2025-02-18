import { fetchAuth } from "@/app/lib/fetchAuth";
import { IMeta, IPaginationResponse } from "@/app/interfaces/pagination";
import { IQueryClienteParams } from "../interfaces/cliente";
import { IClient, ISendMail } from "@/app/(easycob)/interfaces/clients";
import * as dotEnv from "dotenv";
import { ITag } from "@/app/(easycob)/admin/tags/interfaces/tag";
dotEnv.config();

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

export const fetchClients = async (
  initialQuery: IQueryClienteParams
): Promise<IPaginationResponse<IClient>> => {
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

export const sendMail = async (mail: ISendMail) => {
  const formData = new FormData();

  // Converter o objeto data em FormData
  Object.entries(mail).forEach(([key, value]) => {
    if (key === "file" && value.length > 0) {
      formData.append("file", value[0]);
    } else {
      formData.append(key, value);
    }
  });

  const result = await fetchAuth(`${url}/mail`, {
    method: "POST",
    body: formData,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    if (result.errors) {
      throw result.errors;
    } else {
      throw new Error(result.error);
    }
  }
};

export const attachTag = async (
  codCredorDesRegis: String | Number,
  tagId: number | string
) => {
  const result = await fetchAuth(`${url}/${codCredorDesRegis}/tags`, {
    method: "POST",
    body: JSON.stringify({ tagId }),
  });
};

export const detachTag = async (
  codCredorDesRegis: String | Number,
  tagId: number | string
) => {
  const result = await fetchAuth(`${url}/${codCredorDesRegis}/tags`, {
    method: "DELETE",
    body: JSON.stringify({ tagId }),
  });
};

export const clearTags = async (
  codCredorDesRegis: String | Number
) => {
  const result = await fetchAuth(`${url}/${codCredorDesRegis}/tags/clear`, {
    method: "DELETE",
  });
};

export const fetchTagsClient = async (codCredorDesRegis: String | Number) => {
  const result = await fetchAuth<ITag[]>(`${url}/${codCredorDesRegis}/tags`);
  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    if (result.errors) {
      throw result.errors;
    } else {
      throw new Error(result.error);
    }
  }
};