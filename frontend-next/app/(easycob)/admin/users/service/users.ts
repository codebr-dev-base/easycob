import { IUser } from "@/app/interfaces/auth";
import { IQueryUserParams } from "../interfaces/user";
import { IMeta } from "@/app/interfaces/pagination";
import { fetchAuth } from "@/app/lib/fetchAuth";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/user";
const url = `${apiUrl}${urn}`;

export const query: IQueryUserParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
};

export const fetchUsers = async (): Promise<{
  data: IUser[];
  meta: IMeta;
}> => {
  const result = await fetchAuth(url, {
    query,
  });

  console.log(result);

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
