"use client";
import { fetchAuth } from "@/app/lib/fetchAuth";
import { ICampaign } from "../interfaces/campaign";
import { IMeta } from "@/app/interfaces/meta";
import { useState } from "react";

export default function useCampaign() {
  const apiUrl = process.env.API_URL
    ? process.env.API_URL
    : process.env.NEXT_PUBLIC_API_URL;
  const urn = "/v1/campaign";
  const url = `${apiUrl}${urn}`;

  const query = {
    page: 1,
    perPage: 10,
    orderBy: "id",
    descending: true,
    keyword: "",
    keywordColumn: null,
    startDate: null,
    endDate: null,
    type: "SMS",
  };

  const getCampaigns = () => {
    const [data, setData] = useState<ICampaign[]>([]);
    const [meta, setMeta] = useState<IMeta>();

    const fetch = async (): Promise<{ data: ICampaign[]; meta: IMeta }> => {
      const result = await fetchAuth(url, {
        query,
      });

      if (result.success) {
        console.log("Dados recebidos:", result.data);
        return result.data;
      } else {
        console.error("Erro ao buscar dados:", result.error);
        throw new Error(result.error);
      }
    };

    const refresh = async () => {
        const result = await fetch();
        setData(result.data);
        setMeta(result.meta);
    }
    
    return {
      query,
      meta,
      data,
      refresh
    };
  };

  return {
    getCampaigns,
  };
}
