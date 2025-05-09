import { fetchAuth } from "@/app/lib/fetchAuth";
import { IMeta } from "@/app/interfaces/pagination";
import { IQueryDiscountParams } from "../interfaces/discounts";
import { INegotiationInvoice } from "@/app/(easycob)/interfaces/actions";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/action";
const url = `${apiUrl}${urn}`;

export const queryInvoices: IQueryDiscountParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
};

export const fetchInvoices = async (): Promise<{
  data: INegotiationInvoice[];
  meta: IMeta;
}> => {
  const result = await fetchAuth(`${url}/negotiation/invoice`, {
    query: queryInvoices,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const updateInvoice = async (partial: any) => {
  const result = await fetchAuth(`${url}/negotiation/invoice/${partial.id}`, {
    method: "PUT",
    body: JSON.stringify(partial),
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};
