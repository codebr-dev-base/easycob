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
import {
  formatDateToBR,
  formatCurrencyToBRL,
  formatarFone,
  getFirstAndLastName,
} from "@/app/lib/utils";
import Pagination from "@/app/(easycob)/components/Pagination2";
import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa";
import Tooltips from "../../../components/Tooltips";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import Link from "next/link";
import { IMeta, IPaginationResponse } from "@/app/interfaces/pagination";
import { INegotiationInvoice } from "../../../interfaces/actions";
import { BsCheck, BsHourglassSplit } from "react-icons/bs";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable2";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import FormInvoiceHistories from "./FormInvoiceHistories";
import { IQueryFollowingParams } from "../interfaces/following";

export default function TabInvoices({
  invoices,
  query,
  refresh,
  pending,
}: {
  invoices: IPaginationResponse<INegotiationInvoice>;
  query: IQueryFollowingParams;
  refresh: (newParams: Partial<IQueryFollowingParams>) => void;
  pending: boolean;
}) {
  const [selectRow, setSelectRow] = useState<INegotiationInvoice | null>(null);
  const [openForm, setOpenForm] = useState(false);
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

  const handleSelectRow = (invoice: INegotiationInvoice) => {
    if (selectRow && selectRow.id === invoice.id) {
      setSelectRow(null);
      setOpenForm(false);
    } else {
      setSelectRow(invoice);
      setOpenForm(true);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectRow(null);
      setOpenForm(open);
    }
  };

  return (
    <Card>
      <CardContent>
        <FormInvoiceHistories
          open={openForm}
          onOpenChange={handleOpenChange}
          selectRow={selectRow}
        />
        {/* Skeleton com transição de opacidade */}
        <div
          className={`inset-0 transition-opacity duration-1000 ${
            pending ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <SkeletonTable
            rows={
              invoices.meta && invoices.meta.perPage
                ? invoices.meta.perPage
                : query.perPage
            }
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
                <TableHead></TableHead>
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
                <TableHead>Contrato</TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Cliente"
                    fieldName="client"
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
                <TableHead>Contato</TableHead>

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
              {invoices.data.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Switch
                      checked={!!selectRow && selectRow.id === invoice.id}
                      onCheckedChange={() => {
                        handleSelectRow(invoice);
                      }}
                    />
                  </TableCell>
                  <TableCell>{selecIcon(invoice.status)}</TableCell>
                  <TableCell>{formatDateToBR(invoice.datPrest)}</TableCell>
                  <TableCell>{formatDateToBR(invoice.createdAt)}</TableCell>
                  <TableCell>{invoice.desContr}</TableCell>
                  <TableCell className="max-w-36 md:max-w-44 lg:max-w-52 truncate hover:text-clip">
                    <Tooltips message={invoice.client ? invoice.client : ""}>
                      <p className="truncate hover:text-clip">
                        {invoice.client}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell>{formatCurrencyToBRL(invoice.valPrest)}</TableCell>
                  <TableCell>
                    {formatarFone(invoice.contato ? invoice.contato : "")}
                  </TableCell>
                  <TableCell className="max-w-36 md:max-w-44 lg:max-w-52 truncate hover:text-clip hover:cursor-pointer">
                    <Tooltips message={invoice.user ? invoice.user : ""}>
                      <p className="truncate hover:text-clip">
                        {getFirstAndLastName(`${invoice.user}`)}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell className="flex">
                    <Button asChild className="mx-1">
                      <Link
                        href={`/operation/clients/details/${invoice.codCredorDesRegis}`}
                      >
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
        <Pagination meta={invoices.meta} query={query} refresh={refresh} />
      </CardFooter>
    </Card>
  );
}
