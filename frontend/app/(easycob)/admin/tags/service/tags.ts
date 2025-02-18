import { fetchAuth } from "@/app/lib/fetchAuth";
import { ITag } from "../interfaces/tag";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/tag";
const url = `${apiUrl}${urn}`;

export const fetchTags = async (): Promise<ITag[]> => {
  const result = await fetchAuth(url);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};