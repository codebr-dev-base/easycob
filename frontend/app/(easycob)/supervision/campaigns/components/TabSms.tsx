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
import { useEffect } from "react";
import { formatDateToBR, formatarFone } from "@/app/lib/utils";
import Pagination from "@/app/(easycob)/components/Pagination";
import { IUseCampaign } from "../interfaces/campaign";
import { Button } from "@/components/ui/button";
import { FiSend } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import Tooltips from "../../../components/Tooltips";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import { sendCampaign } from "../service/campaigns";
import { toast } from "@/hooks/use-toast";
import { handlerError } from "@/app/lib/error";
import Link from "next/link";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable";

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

  const handleResend = async (id: number | string) => {
    try {
      await await sendCampaign(id);
      toast({
        title: "Sucesso",
        description: "Campanha enviada!",
        variant: "success",
      });
    } catch (error) {
      handlerError(error);
    }
  };

  return (
    <Card>
      <CardContent>
        {/* Skeleton com transição de opacidade */}
        <div
          className={`inset-0 transition-opacity duration-1000 ${
            pending ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <SkeletonTable
            rows={meta && meta.perPage ? meta.perPage : query.perPage}
          />
        </div>

        {/* Tabela com transição de opacidade */}
        <div
          className={`transition-opacity duration-1000 ${
            pending ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <HeaderTable
                    columnName="Id"
                    fieldName="id"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Data"
                    fieldName="date"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Nome"
                    fieldName="name"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Mensagem"
                    fieldName="message"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Whatsapp"
                    fieldName="numWhatsapp"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Usuário"
                    fieldName="user"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.id}</TableCell>
                  <TableCell>{formatDateToBR(campaign.date)}</TableCell>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell className="max-w-52 md:max-w-md lg:max-w-lg truncate hover:text-clip">
                    <Tooltips
                      message={campaign.message ? campaign.message : ""}
                    >
                      <p className="truncate hover:text-clip">
                        {campaign.message}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell>{formatarFone(campaign.numWhatsapp)}</TableCell>
                  <TableCell>{campaign.user}</TableCell>
                  <TableCell className="flex">
                    {campaign.pendencies && (
                      <Button
                        variant={"destructive"}
                        className="mx-1"
                        onClick={() => {
                          handleResend(campaign.id);
                        }}
                      >
                        <FiSend />
                      </Button>
                    )}

                    <Button asChild className="mx-1">
                      <Link href={`/supervision/campaigns/lots/${campaign.id}`}>
                        <FaRegEye />
                      </Link>
                    </Button>
                    <Button asChild className="mx-1" variant={"destructive"}>
                      <Link
                        href={`/supervision/campaigns/errors/${campaign.id}`}
                      >
                        <FaRegEye />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter
        className={`flex justify-end transition-opacity duration-1000 ${
          pending ? "opacity-0 hidden" : "opacity-100"
        }`}
      >
        <Pagination meta={meta} query={query} refresh={refresh} />
      </CardFooter>
    </Card>
  );
}
