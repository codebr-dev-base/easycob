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
import { IPromiseOfPayment } from "@/app/(easycob)/interfaces/actions";
import { BsCheck, BsHourglassSplit } from "react-icons/bs";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable";

export default function TabPromises({
  query,
  meta,
  data,
  refresh,
  pending,
}: {
  query: IQueryDiscountParams;
  meta?: IMeta;
  data: IPromiseOfPayment[];
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
                    fieldName="datPrev"
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
                    columnName="V. Débito"
                    fieldName="valPrest"
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
              {data.map((promese) => (
                <TableRow key={promese.id}>
                  <TableCell>{selecIcon(promese.status)}</TableCell>
                  <TableCell>
                    {promese.datPrev ? formatDateToBR(promese.datPrev) : ""}
                  </TableCell>
                  <TableCell>{formatDateToBR(promese.createdAt)}</TableCell>
                  <TableCell>
                    {promese.valPrest ? formatToBRL(promese.valPrest) : ""}
                  </TableCell>
                  <TableCell>
                    {promese.valOriginal
                      ? formatToBRL(promese.valOriginal)
                      : ""}
                  </TableCell>
                  <TableCell className="max-w-36 md:max-w-44 lg:max-w-52 truncate hover:text-clip">
                    <Tooltips message={promese.client ? promese.client : ""}>
                      <p className="truncate hover:text-clip">
                        {promese.client}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell>
                    {formatarFone(promese.contato ? promese.contato : "")}
                  </TableCell>
                  <TableCell>{promese.desContr}</TableCell>
                  <TableCell className="max-w-36 md:max-w-44 lg:max-w-52 truncate hover:text-clip">
                    <Tooltips message={promese.user ? promese.user : ""}>
                      <p className="truncate hover:text-clip">{promese.user}</p>
                    </Tooltips>
                  </TableCell>
                  <TableCell className="flex">
                    <Button asChild className="mx-1">
                      <Link href={`/supervision/campaigns/lots/${promese.id}`}>
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