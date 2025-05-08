import { fetchAuth } from "@/app/lib/fetchAuth";
import { IMeta } from "@/app/interfaces/pagination";
import { IQueryDiscountParams } from "../interfaces/discounts";
import { INegotiationOfPayment } from "@/app/(easycob)/interfaces/actions";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/action";
const url = `${apiUrl}${urn}`;

export const queryNegotiations: IQueryDiscountParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  nomLoja: "all"
};

export const fetchNegotiations = async (): Promise<{
  data: INegotiationOfPayment[];
  meta: IMeta;
}> => {
  const result = await fetchAuth(`${url}/negotiation`, {
    query: queryNegotiations,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const updateNegotiation = async (partial: any) => {
  const result = await fetchAuth(
    `${url}/negotiation/${partial.id}`,
    {
      method: "PUT",
      body: JSON.stringify(partial)
    }
  );

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};
