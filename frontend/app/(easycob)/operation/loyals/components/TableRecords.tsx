"use client";
import { IMeta, IQueryPaginationParams } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import Pagination from "@/app/(easycob)/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable";
import Tooltips from "@/app/(easycob)/components/Tooltips";
import {
  formatDateToBR,
  formatStringToCpfCnpj,
  formatCurrencyToBRL,
  formatarFone,
} from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { ILoyal } from "../interfaces/loyal";
import { Fragment, useState } from "react";
import TableDetails from "./TableDetails";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { LogIn } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { check } from "../service/loyals";

export default function TableRecords({
  meta,
  data,
  refresh,
  query,
  pending,
}: {
  meta: IMeta;
  data: ILoyal[];
  refresh: () => {};
  query: IQueryPaginationParams;
  pending: boolean;
}) {
  const [selectLoyal, setSelectLoyal] = useState<ILoyal | null>(null);

  const handleSelectLoyal = (loyal: ILoyal) => {
    if (selectLoyal && selectLoyal.id === loyal.id) {
      setSelectLoyal(null);
    } else {
      setSelectLoyal(loyal);
    }
  };

  const setColorRow = (loyal: ILoyal) => {
    if (loyal.classSitcontr === "ATIVO") {
      return "";
    }

    if (loyal.classSitcontr === "PENDENTE") {
      return "text-red-400";
    }

    if (loyal.classSitcontr === "ENCERRADO") {
      return "text-slate-400";
    }
    return "";
  };

  const handleChengeCheck = async (loyal: ILoyal) => {
    await check(loyal.id);
    refresh();
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
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Dt. U. acion."
                    fieldName="lastAction"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>

                <TableHead>
                  <HeaderTable
                    columnName="Unidade"
                    fieldName="unidade"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Nome do Cliente"
                    fieldName="nomClien"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Contrato"
                    fieldName="desContr"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Faixa de Tempo"
                    fieldName="faixaTempo"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Faixa de Valor"
                    fieldName="faixaValor"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Faixa de Títulos"
                    fieldName="faixaTitulos"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Cluster"
                    fieldName="classCluster"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((loyal) => (
                <Fragment key={loyal.id}>
                  <TableRow className={setColorRow(loyal)}>
                    <TableCell
                      onClick={() => {
                        handleSelectLoyal(loyal);
                      }}
                      className="hover:cursor-pointer bg-slate-100"
                    >
                      {selectLoyal && selectLoyal.id === loyal.id ? (
                        <FaCaretUp />
                      ) : (
                        <FaCaretDown />
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        id="airplane-mode"
                        checked={loyal.check}
                        onCheckedChange={() => {
                          handleChengeCheck(loyal)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {formatDateToBR(`${loyal.lastAction}`)}
                    </TableCell>
                    <TableCell>{loyal.unidade}</TableCell>
                    <TableCell className="max-w-28 md:max-w-36 lg:max-w-48">
                      <Tooltips message={loyal.nomClien ? loyal.nomClien : ""}>
                        <p className="truncate hover:text-clip">
                          {loyal.nomClien}
                        </p>
                      </Tooltips>
                    </TableCell>
                    <TableCell>{loyal.desContr}</TableCell>
                    <TableCell>{loyal.faixaTempo}</TableCell>
                    <TableCell>{loyal.faixaValor}</TableCell>
                    <TableCell>{loyal.faixaTitulos}</TableCell>
                    <TableCell>{loyal.classCluster}</TableCell>

                    <TableCell>
                      <Button asChild className="mx-1">
                        <Link
                          href={`/operation/clients/details/${loyal.codCredorDesRegis}`}
                        >
                          <FaUser />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    className={
                      !!selectLoyal && selectLoyal.id === loyal.id
                        ? ""
                        : "hidden"
                    }
                  >
                    <TableCell colSpan={12}>
                      <TableDetails loyal={loyal} />
                    </TableCell>
                  </TableRow>
                </Fragment>
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
