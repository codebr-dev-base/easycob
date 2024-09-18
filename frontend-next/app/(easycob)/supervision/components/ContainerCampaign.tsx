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
import { FaUserPlus, FaSearch, FaKey, FaCheck, FaUser } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "../../components/DatePicker";
import campaignService from "../service/campaigns";
import { DateRange } from "react-day-picker";
const { useGetPagination } = campaignService();

export default function ContainerCampaign() {
  const { meta, data, refresh, query, pending } = useGetPagination();

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "keyword") {
      query.keyword = e.target.value;
      refresh();
    }
  };

  const handleChangeKeywordColumn = (value: string) => {
    console.log(value);
    query.keywordColumn = value;
  };

  const handlerChangeDate = (range: DateRange) => {
    console.log(range);
    if (range.from && range.to) {
      query.startDate = range.from?.toISOString().split("T")[0];
      query.endDate = range.to?.toISOString().split("T")[0];
      refresh();
    }
  };

  return (
    <article>
      <Header title="Campanhas">
        <div className="flex justify-end items-center gap-4">
          <DatePicker placeholder="Ínicio" onChange={handlerChangeDate} />
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
          <Button variant="ghost" className="bg-white space-x-2">
            <FaUserPlus className="text-foreground" />
            <span className="text-foreground">Novo usuário</span>
          </Button>
        </div>
      </Header>
      <main>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="flex justify-center bg-white">
            <TabsTrigger value="account">Campanha SMS</TabsTrigger>
            <TabsTrigger value="password">Campanha Email</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="px-4">
            <TabSms
              meta={meta}
              data={data}
              refresh={refresh}
              query={query}
              pending={pending}
            />
          </TabsContent>
          <TabsContent value="password" className="px-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </article>
  );
}
