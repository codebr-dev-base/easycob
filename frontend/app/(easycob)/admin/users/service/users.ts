import { IUser } from "@/app/interfaces/auth";
import { IQueryUserParams } from "../interfaces/user";
import { IMeta } from "@/app/interfaces/pagination";
import { fetchAuth } from "@/app/lib/fetchAuth";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/user";
const url = `${apiUrl}${urn}`;

export let query: IQueryUserParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  status: "true",
  keywordColumn: "name",
};

// Função para atualizar `query`
export function setQuery(newParams: Partial<IQueryUserParams>): void {
  query = { ...query, ...newParams };
}

export const fetchUsers = async (): Promise<{
  data: IUser[];
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

export const fetchUserByModule = async (
  moduleName: string,
  status: boolean
) => {
  const result = await fetchAuth<IUser[]>(`${url}/module/${moduleName}`, {
    query: { status },
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const createUser = async (user: IUser) => {
  const result = await fetchAuth<IUser>(`${url}`, {
    method: "POST",
    body: JSON.stringify(user),
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result;
  } else {
    throw result;
  }
};

export const updateUser = async (user: IUser) => {
  const result = await fetchAuth<IUser>(`${url}/${user.id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result;
  } else {
    throw result;
  }
};

export const updatePassword = async (user: IUser) => {
  const result = await fetchAuth<IUser>(`${url}/${user.id}`, {
    method: "PATCH",
    body: JSON.stringify(user),
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result;
  } else {
    throw result;
  }
};

export const deleteUser = async (user: IUser) => {
  const result = await fetchAuth<IUser>(`${url}/${user.id}`, {
    method: "DELETE",
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result;
  } else {
    throw result;
  }
};