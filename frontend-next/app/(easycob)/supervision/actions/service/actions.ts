import { fetchAuth } from "@/app/lib/fetchAuth";
import { IMeta } from "@/app/interfaces/pagination";
import {
  IChartChannelResponse,
  IChartConfig,
  IChartData,
  IChartDataStack,
  IQueryActionParams,
  IReturnType,
  IUserAndCpc,
  IUserAndTypesData,
  IUserChannel,
} from "../interfaces/action";
import { IAction, ITypeAction } from "@/app/(easycob)/interfaces/actions";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/action";
const url = `${apiUrl}${urn}`;

export const query: IQueryActionParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  keywordColumn: "cliente",
};

export const fetchActions = async (): Promise<{
  data: IAction[];
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

export const fetchUserAndTypes = async (): Promise<IUserAndTypesData[]> => {
  const result = await fetchAuth(`${url}/list/user/type`, {
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

export const fetchUserAndCpc = async (): Promise<IUserAndCpc[]> => {
  const result = await fetchAuth(`${url}/list/user/cpc`, {
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

export const fetchTypesActions = async () => {
  const result = await fetchAuth<ITypeAction[]>(`${url}/type-action`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchReturnsTypes = async () => {
  const result = await fetchAuth<IReturnType[]>(`${url}/returns/types`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const fetchChartType = async (): Promise<{
  chartData: IChartData[];
  chartConfig: IChartConfig;
}> => {
  const result = await fetchAuth(`${url}/chart/type`, {
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

export const fetchChartUser = async (): Promise<{
  chartData: IChartData[];
  chartConfig: IChartConfig;
}> => {
  const result = await fetchAuth(`${url}/chart/user`, {
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

export const fetchChartUserAndType = async (): Promise<{
  chartData: IChartDataStack[];
  chartConfig: IChartConfig;
}> => {
  const result = await fetchAuth(`${url}/chart/user/type`, {
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

export const fetchChartUserAndCpc = async (): Promise<{
  chartData: IChartDataStack[];
  chartConfig: IChartConfig;
}> => {
  const result = await fetchAuth(`${url}/chart/user/cpc`, {
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

export const fetchChartUserAndChannel = async (): Promise<IChartChannelResponse> => {
  const result = await fetchAuth(`${url}/chart/user/channel`, {
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

export const fetchUserAndChannel = async (): Promise<IUserChannel[]> => {
  const result = await fetchAuth(`${url}/list/user/channel`, {
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