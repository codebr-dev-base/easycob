import { fetchAuth } from "@/app/lib/fetchAuth";
import { IMeta } from "@/app/interfaces/pagination";
import { IErrorLot, IQueryLotParams } from "../interfaces/campaign";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/campaign/error";
const url = `${apiUrl}${urn}`;

export const query: IQueryLotParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: true,
  keyword: "",
  keywordColumn: "name",
};

export const fetchErrors = async (campaignId: number | string): Promise<{
  data: IErrorLot[];
  meta: IMeta;
}> => {
  const result = await fetchAuth(`${url}/${campaignId}`, {
    query: {...query, campaignId},
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};
