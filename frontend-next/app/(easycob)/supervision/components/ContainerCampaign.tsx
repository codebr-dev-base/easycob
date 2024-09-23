"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TabSms from "@/app/(easycob)/supervision/components/TabSms";
import Header from "../../components/Header";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "../../components/DatePicker";
import { fetchCampaign, query } from "../service/campaigns";
import { DateRange } from "react-day-picker";
import { DialogCampaign } from "./DialogCampaign";
import { IMeta } from "@/app/interfaces/pagination";
import { ICampaign } from "../interfaces/campaign";
import TabEmail from "./TabEmail";
import "@/app/assets/css/tabs.css";

export default function ContainerCampaign({
  campaigns,
}: {
  campaigns: {
    meta: IMeta;
    data: ICampaign[];
  };
}) {
  const meta = useRef<IMeta>(campaigns.meta);
  const data = useRef<ICampaign[]>(campaigns.data ? campaigns.data : []);
  const [pending, setPending] = useState<boolean>(false);
  const [type, setType] = useState<string>("SMS");

  const refresh = async () => {
    setPending(true);
    const result = await fetchCampaign();
    meta.current = result.meta;
    data.current = result.data;
    setPending(false);
  };

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "keyword") {
      query.keyword = e.target.value;
      refresh();
    }
  };

  const handleChangeKeywordColumn = (value: string) => {
    query.keywordColumn = value;
  };

  const handleChangeDate = (range: DateRange) => {
    if (range.from && range.to) {
      query.startDate = range.from?.toISOString().split("T")[0];
      query.endDate = range.to?.toISOString().split("T")[0];
      refresh();
    }
  };

  const handleTabChange = (value: string) => {
    query.type = value;
    setType(value);
    refresh();
  };

  return (
    <article>
      <Header title="Campanhas">
        <div className="flex flex-col md:flex-row justify-end items-end gap-4">
          <DatePicker placeholder="Ínicio" onChange={handleChangeDate} />

          <RadioGroup
            defaultValue={query.keywordColumn ? query.keywordColumn : "name"}
            className="flex"
            onValueChange={handleChangeKeywordColumn}
          >
            <label className="text-white">
              <span className="px-1">Nome:</span>
              <RadioGroupItem value="name" className="radio-button-bar" />
            </label>
            <label className="text-white">
              <span className="px-1">Usuário:</span>
              <RadioGroupItem value="user" className="radio-button-bar" />
            </label>
          </RadioGroup>

          <div className="inline-flex items-center group">
            <div className="bg-white flex items-center justify-center rounded rounded-r-none mt-1 p-3 border ring-offset-background group-focus:ring-2">
              <FaSearch className="text-foreground" />
            </div>
            <Input
              name="keyword"
              placeholder="Buscar.."
              className="rounded-l-none"
              onChange={handleChangeKeyword}
            />
          </div>
          <DialogCampaign refresh={refresh} query={query} type={type} />
        </div>
      </Header>

      <main>
        <Tabs
          defaultValue="SMS"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="flex justify-center bg-white">
            <TabsTrigger value="SMS" className="TabsTrigger">
              Campanha SMS
            </TabsTrigger>
            <TabsTrigger value="EMAIL" className="TabsTrigger">
              Campanha Email
            </TabsTrigger>
          </TabsList>
          <TabsContent value="SMS" className="px-4">
            <TabSms
              meta={meta.current}
              data={data.current}
              refresh={refresh}
              query={query}
              pending={pending}
            />
          </TabsContent>
          <TabsContent value="EMAIL" className="px-4">
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
