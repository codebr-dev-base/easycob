"use client";
import Header from "../../../components/Header";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IMeta } from "@/app/interfaces/pagination";
import { ILot, ICampaign } from "../interfaces/campaign";
import "@/app/assets/css/tabs.css";
import { fetchLots, query } from "../service/lots";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Pagination from "@/app/(easycob)/components/Pagination";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import { FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Tooltips from "@/app/(easycob)/components/Tooltips";
import { formatarFone, formatDateToBR } from "@/app/lib/utils";
import FilterPusLot from "./FilterPusLot";
import { IUser } from "@/app/interfaces/auth";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable";

export default function ContainerLot({
  lots,
  campaign,
  operators,
}: {
  lots: {
    meta: IMeta;
    data: ILot[];
  };
  campaign: ICampaign;
  operators: IUser[];
}) {
  const [meta, setMeta] = useState<IMeta>(lots.meta);
  const [data, setData] = useState<ILot[]>(lots.data ? lots.data : []);
  const [pending, setPending] = useState<boolean>(false);

  const refresh = async () => {
    setPending(true);
    const result = await fetchLots(campaign.id);
    setMeta(result.meta);
    setData(result.data);
    setPending(false);
  };

  return (
    <article>
      <div className="p-2">
        <Header title="Campanhas">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FilterPusLot query={query} refresh={refresh} />
          </div>
        </Header>
      </div>

      <main className="p-2">
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>Dados da campanha</CardTitle>
            <CardDescription>
              {campaign.name} - {formatDateToBR(campaign.date)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Whatsapp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="relative">
            {/* Skeleton com transição de opacidade */}
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ${
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
                        columnName="Cliente"
                        fieldName="cliente"
                        query={query}
                        refresh={refresh}
                      />
                    </TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>
                      <HeaderTable
                        columnName="Filial"
                        fieldName="filial"
                        query={query}
                        refresh={refresh}
                      />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((lot) => (
                    <TableRow key={lot.id}>
                      <TableCell>{lot.id}</TableCell>
                      <TableCell className="max-w-32 md:max-w-48 lg:max-w-64 truncate hover:text-clip">
                        <Tooltips message={lot.cliente ? lot.cliente : ""}>
                          <p className="truncate hover:text-clip">
                            {lot.cliente}
                          </p>
                        </Tooltips>
                      </TableCell>
                      <TableCell>{lot.contrato}</TableCell>
                      <TableCell>{lot.contato}</TableCell>
                      <TableCell>{lot.filial}</TableCell>
                      <TableCell>{lot.status}</TableCell>
                      <TableCell>
                        <Button asChild className="mx-1">
                          <Link href={`/operation/clients/details/${lot.codCredorDesRegis}`}>
                            <FaUser />
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
      </main>
    </article>
  );
}
