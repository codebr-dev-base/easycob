/* eslint-disable react-hooks/exhaustive-deps */
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
import { useEffect, useState } from "react";
import { formatDateToBR, formatarFone } from "@/app/lib/utils";
import Pagination from "@/app/(easycob)/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { IUseCampaign } from "../interfaces/campaign";

export default function TabEmail({
  query,
  meta,
  data,
  refresh,
  pending,
}: IUseCampaign) {
  useEffect(() => {
    refresh();
  }, []);

  const skeletons = [];
  for (let i = 0; i < 12; i++) {
    skeletons.push(<Skeleton key={i} className="h-10 w-full my-2" />);
  }

  return (
    <Card>
      <CardContent className="relative">
        {/* Skeleton com transição de opacidade */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            pending ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <div className="py-2">{skeletons}</div>
        </div>
        {/* Tabela com transição de opacidade */}
        <div
          className={`transition-opacity duration-1000 ${
            pending ? "opacity-0" : "opacity-100"
          }`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Whatsapp</TableHead>
                <TableHead>Usuário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.id}</TableCell>
                  <TableCell>{formatDateToBR(campaign.date)}</TableCell>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{formatarFone(campaign.numWhatsapp)}</TableCell>
                  <TableCell>{campaign.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Pagination meta={meta} query={query} refresh={refresh} />
      </CardFooter>
    </Card>
  );
}
