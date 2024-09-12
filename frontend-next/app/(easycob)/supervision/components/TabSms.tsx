"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCampaign from "../service/campaigns";
import { useEffect, useState } from "react";
import { formatDateToBR, formatarFone } from "@/app/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const { getCampaigns } = useCampaign();

export default function TabSms() {
  const { meta, data: campaigns, refresh, query } = getCampaigns();

  useEffect(() => {
    refresh();
  }, []);

  const handlerNextPage = (e: Event) => {
    e.preventDefault();
    query.page = query.page + 1;
    refresh();
  };
  const handlerPreviousPage = (e: Event) => {
    e.preventDefault();
    query.page = query.page - 1;
    refresh();
  };

  const handlerChangePerPage = (velue: string) => {
    query.perPage = Number(velue);
    refresh();
  };
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Whatsapp</TableHead>
              <TableHead>Usuário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>{campaign.id}</TableCell>
                <TableCell>{formatDateToBR(campaign.date)}</TableCell>
                <TableCell className="max-w-52 md:max-w-md lg:max-w-lg">
                  <p className="truncate hover:text-clip">{campaign.message}</p>
                </TableCell>
                <TableCell>{formatarFone(campaign.numWhatsapp)}</TableCell>
                <TableCell>{campaign.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <span className="px-2 text-sm">Mostrando</span>
        <Select
          onValueChange={handlerChangePerPage}
          defaultValue={`${query.perPage}`}
        >
          <SelectTrigger className="w-16">
            <SelectValue placeholder="Mostrando" />
          </SelectTrigger>
          <SelectContent className="w-36">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="px-2 text-sm">de {meta?.total} resultados.</span>
      </CardFooter>
    </Card>
  );
}
