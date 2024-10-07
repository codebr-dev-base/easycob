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
import { formatDateToBR, formatToBRL, formatarFone } from "@/app/lib/utils";
import Pagination from "@/app/(easycob)/components/Pagination";
import { Button } from "@/components/ui/button";
import { FaRegEye } from "react-icons/fa";
import Tooltips from "../../../components/Tooltips";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import Link from "next/link";
import { IQueryDiscountParams } from "../interfaces/discounts";
import { IMeta } from "@/app/interfaces/pagination";
import { INegotiationInvoice } from "../../../interfaces/actions";
import { BsCheck, BsHourglassSplit } from "react-icons/bs";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable";

export default function TabInvoices({
  query,
  meta,
  data,
  refresh,
  pending,
}: {
  query: IQueryDiscountParams;
  meta?: IMeta;
  data: INegotiationInvoice[];
  refresh: () => Promise<void>;
  pending: boolean;
}) {
  const selecIcon = (status: boolean) => {
    switch (status) {
      case true:
        return (
          <BsCheck className="text-green-500 text-xl hover:text-2xl text-animate" />
        );
        break;
      default:
        return (
          <BsHourglassSplit className="text-orange-500 text-xl hover:text-2xl text-animate" />
        );
        break;
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
                    columnName="Status"
                    fieldName="status"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Vencimento"
                    fieldName="datPrest"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Criação"
                    fieldName="createdAt"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="V. Prestação"
                    fieldName="valPrest"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  {" "}
                  <HeaderTable
                    columnName="N. da Negociação"
                    fieldName="idNegotiation"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Cliente"
                    fieldName="client"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Operador"
                    fieldName="user"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{selecIcon(invoice.status)}</TableCell>
                  <TableCell>{formatDateToBR(invoice.datPrest)}</TableCell>
                  <TableCell>{formatDateToBR(invoice.createdAt)}</TableCell>
                  <TableCell>{formatToBRL(invoice.valPrest)}</TableCell>
                  <TableCell>{invoice.idNegotiation}</TableCell>
                  <TableCell className="max-w-36 md:max-w-44 lg:max-w-52 truncate hover:text-clip">
                    <Tooltips message={invoice.client ? invoice.client : ""}>
                      <p className="truncate hover:text-clip">
                        {invoice.client}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell>
                    {formatarFone(invoice.contato ? invoice.contato : "")}
                  </TableCell>
                  <TableCell>{invoice.desContr}</TableCell>
                  <TableCell className="max-w-36 md:max-w-44 lg:max-w-52 truncate hover:text-clip">
                    <Tooltips message={invoice.user ? invoice.user : ""}>
                      <p className="truncate hover:text-clip">{invoice.user}</p>
                    </Tooltips>
                  </TableCell>
                  <TableCell className="flex">
                    <Button asChild className="mx-1">
                      <Link href={`/supervision/campaigns/lots/${invoice.id}`}>
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
