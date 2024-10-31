"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabSms from "@/app/(easycob)/supervision/campaigns/components/TabSms";
import Header from "../../../components/Header";
import { useRef, useState } from "react";
import { fetchCampaigns, query } from "../service/campaigns";
import { DialogCampaign } from "./DialogCampaign";
import { IMeta } from "@/app/interfaces/pagination";
import { ICampaign } from "../interfaces/campaign";
import TabEmail from "./TabEmail";
import "@/app/assets/css/tabs.css";
import { IUser } from "@/app/interfaces/auth";
import FilterPus from "./FilterPus";
export default function ContainerCampaign({
  campaigns,
  operators,
}: {
  campaigns: {
    meta: IMeta;
    data: ICampaign[];
  };
  operators: IUser[];
}) {
  const meta = useRef<IMeta>(campaigns.meta);
  const data = useRef<ICampaign[]>(campaigns.data ? campaigns.data : []);
  const [pending, setPending] = useState<boolean>(false);
  const [type, setType] = useState<string>("SMS");

  const refresh = async () => {
    setPending(true);
    const result = await fetchCampaigns();
    meta.current = result.meta;
    data.current = result.data;
    setPending(false);
  };

  const handleTabChange = (value: string) => {
    query.type = value;
    setType(value);
    query.page = 1;
    query.perPage = 10;
    refresh();
  };

  return (
    <article>
      <div className="p-2">
        <Header title="Campanhas">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <DialogCampaign refresh={refresh} query={query} type={type} />
            <FilterPus query={query} refresh={refresh} operators={operators} />
          </div>
        </Header>
      </div>

      <main className="p-2">
        <Tabs
          defaultValue="SMS"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="flex justify-center bg-white rounded-lg border">
            <TabsTrigger value="SMS" className="TabsTrigger">
              Campanha SMS
            </TabsTrigger>
            <TabsTrigger value="EMAIL" className="TabsTrigger">
              Campanha Email
            </TabsTrigger>
          </TabsList>
          <TabsContent value="SMS">
            <TabSms
              meta={meta.current}
              data={data.current}
              refresh={refresh}
              query={query}
              pending={pending}
            />
          </TabsContent>
          <TabsContent value="EMAIL">
            <TabEmail
              meta={meta.current}
              data={data.current}
              refresh={refresh}
              query={query}
              pending={pending}
            />
          </TabsContent>
        </Tabs>
      </main>
    </article>
  );
}
