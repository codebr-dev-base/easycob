"use client";
import { fetchAuth } from "@/app/lib/fetchAuth";
import { ICampaign, IQueryCampaignParams } from "../interfaces/campaign";
import { IMeta } from "@/app/interfaces/pagination";
import { useState } from "react";

export default function campaignService() {
  const apiUrl = process.env.API_URL
    ? process.env.API_URL
    : process.env.NEXT_PUBLIC_API_URL;
  const urn = "/v1/campaign";
  const url = `${apiUrl}${urn}`;

  const query: IQueryCampaignParams = {
    page: 1,
    perPage: 10,
    orderBy: "id",
    descending: true,
    keyword: "",
    keywordColumn: 'name',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    type: "SMS",
  };

  const useGetPagination = () => {

    const [pending, setPending] = useState<boolean>(false);
    const [data, setData] = useState<ICampaign[]>([]);
    const [meta, setMeta] = useState<IMeta>();

    const fetch = async (): Promise<{ data: ICampaign[]; meta: IMeta }> => {
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

    const refresh = async () => {
      if (!pending) {
        setPending(true);
        const result = await fetch();
        setData(result.data);
        setMeta(result.meta);
        setPending(false);
      }
    };

    return {
      query,
      meta,
      data,
      refresh,
      pending,
    };
  };

  return {
    useGetPagination,
  };
}
