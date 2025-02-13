import { fetchAuth } from "@/app/lib/fetchAuth";
import { INegotiationHistory } from "../interfaces/following";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const urn = "/v1/action/negotiation/history";
const url = `${apiUrl}${urn}`;

export const fetchNegotiationHistories = async (
  id: number
): Promise<INegotiationHistory[]> => {
  const result = await fetchAuth(`${url}/${id}`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};
