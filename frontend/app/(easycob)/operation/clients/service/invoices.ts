import { buildQueryString, fetchAuth } from "@/app/lib/fetchAuth";
import {
  IClient,
  IContact,
  IInvoice,
} from "@/app/(easycob)/interfaces/clients";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/recovery/invoice";
const url = `${apiUrl}${urn}`;

export const fetchInvoices = async (
  codCredorDesRegis: String | number,
  desContr: string[] | number[] = []
): Promise<IInvoice[]> => {
  const query = {
    desContr,
  };
  const result = await fetchAuth(
    `${url}/${codCredorDesRegis}?${buildQueryString(query)}`
  );

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};
