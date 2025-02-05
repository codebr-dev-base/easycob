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
  formatCurrencyToBRL,
  formatDateToBR,
  formatarFone,
  getFirstAndLastName,
} from "@/app/lib/utils";
import Pagination from "@/app/(easycob)/components/Pagination";
import { Button } from "@/components/ui/button";
import { FaRegEye } from "react-icons/fa";
import Tooltips from "../../../components/Tooltips";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import Link from "next/link";
import { IQueryDiscountParams } from "../interfaces/discounts";
import { IMeta } from "@/app/interfaces/pagination";
import { INegotiationOfPayment } from "@/app/(easycob)/interfaces/actions";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable";
import { BsCheck, BsHourglassSplit } from "react-icons/bs";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import FormNegotiationHistories from "./FormNegotiationHistories";

export default function TabNegotiations({
  query,
  meta,
  data,
  refresh,
  pending,
}: {
  query: IQueryDiscountParams;
  meta?: IMeta;
  data: INegotiationOfPayment[];
  refresh: () => Promise<void>;
  pending: boolean;
}) {
  const [selectRow, setSelectRow] = useState<INegotiationOfPayment | null>(
    null
  );
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

  const handleSelectRow = (negotiation: INegotiationOfPayment) => {
    if (selectRow && selectRow.id === negotiation.id) {
      setSelectRow(null);
      setOpenForm(false);
    } else {
      setSelectRow(negotiation);
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
        <FormNegotiationHistories
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
                    fieldName="datEntra"
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
                    columnName="V. Original"
                    fieldName="valOriginal"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="V. Negociação"
                    fieldName="valTotalPrest"
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
              {data.map((negotiation) => (
                <TableRow key={negotiation.id}>
                  <TableCell>
                    <Switch
                      checked={!!selectRow && (selectRow.id === negotiation.id)}
                      onCheckedChange={() => {
                        handleSelectRow(negotiation);
                      }}
                    />
                  </TableCell>
                  <TableCell>{selecIcon(negotiation.status)}</TableCell>
                  <TableCell>{formatDateToBR(negotiation.datEntra)}</TableCell>
                  <TableCell>{formatDateToBR(negotiation.createdAt)}</TableCell>
                  <TableCell>{negotiation.desContr}</TableCell>
                  <TableCell className="max-w-36 md:max-w-44 lg:max-w-52 truncate hover:text-clip">
                    <Tooltips
                      message={negotiation.client ? negotiation.client : ""}
                    >
                      <p className="truncate hover:text-clip">
                        {negotiation.client}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell>{formatCurrencyToBRL(negotiation.valOriginal)}</TableCell>
                  <TableCell>
                    {formatCurrencyToBRL(negotiation.valTotalPrest)}
                  </TableCell>
                  <TableCell>
                    {formatarFone(
                      negotiation.contato ? negotiation.contato : ""
                    )}
                  </TableCell>
                  <TableCell className="max-w-36 md:max-w-44 lg:max-w-52 truncate hover:text-clip hover:cursor-pointer">
                    <Tooltips
                      message={negotiation.user ? negotiation.user : ""}
                    >
                      <p className="truncate hover:text-clip">
                        {getFirstAndLastName(`${negotiation.user}`)}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell className="flex">
                    <Button asChild className="mx-1">
                      <Link
                        href={`/supervision/campaigns/lots/${negotiation.id}`}
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
