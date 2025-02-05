import { fetchAuth } from "@/app/lib/fetchAuth";
import { IContract } from "@/app/(easycob)/interfaces/clients";
import { IMeta } from "@/app/interfaces/pagination";
import { IQueryContractsParams } from "../interfaces/contracts";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/recovery/contract";
const url = `${apiUrl}${urn}`;

export const query: IQueryContractsParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  status: "ATIVO",
};

export const fetchContracts = async (
  codCredorDesRegis: String | number
): Promise<{
  data: IContract[];
  meta: IMeta;
}> => {
  const result = await fetchAuth(`${url}/${codCredorDesRegis}`, {
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
