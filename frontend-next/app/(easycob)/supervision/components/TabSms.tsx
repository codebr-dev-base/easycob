"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import Header from "../../components/Header";
import { IUseCampaign } from "../interfaces/campaign";

export default function TabSms({
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
      <CardContent>
        {pending ? (
          <div className="py-2">{skeletons}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Mensagem</TableHead>
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
                  <TableCell className="max-w-52 md:max-w-md lg:max-w-lg">
                    <p className="truncate hover:text-clip">
                      {campaign.message}
                    </p>
                  </TableCell>
                  <TableCell>{formatarFone(campaign.numWhatsapp)}</TableCell>
                  <TableCell>{campaign.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Pagination meta={meta} query={query} refresh={refresh} />
      </CardFooter>
    </Card>
  );
}
