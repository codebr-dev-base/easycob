import { fetchAuth } from "@/app/lib/fetchAuth";
import {
  ICampaign,
  IFormCampaignValues,
  IQueryCampaignParams,
  ITemplateSms,
} from "../interfaces/campaign";
import { IMeta } from "@/app/interfaces/pagination";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/campaign";
const url = `${apiUrl}${urn}`;

export const query: IQueryCampaignParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: true,
  keyword: "",
  keywordColumn: "name",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  type: "SMS",
};

export const fetchCampaigns = async (): Promise<{
  data: ICampaign[];
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

export const createCampaign = async (
  template: IFormCampaignValues
): Promise<ITemplateSms[]> => {
  const formData = new FormData();

  // Converter o objeto data em FormData
  Object.entries(template).forEach(([key, value]) => {
    if (key === "file" && value.length > 0) {
      formData.append("file", value[0]);
    } else {
      formData.append(key, value);
    }
  });

  const result = await fetchAuth(url, {
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

export const sendCampaign = async (id: number | string) => {
  const result = await fetchAuth(`${url}/send/${id}`);

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

export const fetchCampaign = async (id: number | string): Promise<ICampaign> => {
  const result = await fetchAuth(`${url}/${id}`);

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
