"use client";
import { IMeta, IQueryPaginationParams } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import Pagination from "@/app/(easycob)/components/Pagination";
import { IAction } from "@/app/(easycob)/interfaces/actions";
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
  BsFillSendCheckFill,
  BsFillSendSlashFill,
  BsHourglassSplit,
} from "react-icons/bs";
import { formatDateToBR, formatCurrencyToBRL, formatDateToDatePtBr, formatTimeToDatePtBr } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

const selecIcon = (action: any) => {
  switch (action.retorno) {
    case "00":
      return (
        <BsFillSendCheckFill className="text-green-500 text-xl hover:text-2xl text-animate" />
      );
      break;
    case "Q":
      return (
        <BsHourglassSplit className="text-orange-500 text-xl hover:text-2xl text-animate" />
      );
      break;
    default:
      return (
        <BsFillSendSlashFill className="text-red-500 text-xl hover:text-2xl text-animate" />
      );
      break;
  }
};

export default function TabRecords({
  meta,
  data,
  refresh,
  query,
  pending,
}: {
  meta: IMeta;
  data: IAction[];
  refresh: () => {};
  query: IQueryPaginationParams;
  pending: boolean;
}) {
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
                    fieldName="createdAt"
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
                <TableHead>
                  Contrato
                </TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Status"
                    fieldName="retorno"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Retorno"
                    fieldName="retornotexto"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="D.Atraso"
                    fieldName="dayLate"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="V.Carteira"
                    fieldName="valPrinc"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="PECLD"
                    fieldName="pecld"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Tipo"
                    fieldName="typeAction"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
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
              {data.map((action) => (
                <TableRow key={action.id}>
                  <TableCell>{action.id}</TableCell>
                  <TableCell>
                    {formatDateToDatePtBr(action.createdAt)}
                    <br />
                    {formatTimeToDatePtBr(action.createdAt)}
                  </TableCell>

                  <TableCell className="max-w-28 md:max-w-36 lg:max-w-48">
                    <Tooltips message={action.cliente ? action.cliente : ""}>
                      <p className="truncate hover:text-clip">
                        {action.cliente}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell className="max-w-28 md:max-w-36 lg:max-w-48">
                    {action.desContr}
                  </TableCell>
                  <TableCell className="max-w-28 md:max-w-36 lg:max-w-48">
                    {action.subsidiary}
                  </TableCell>
                  <TableCell className="">{selecIcon(action)}</TableCell>
                  <TableCell className="max-w-28 md:max-w-36 lg:max-w-48">
                    <Tooltips
                      message={action.retornotexto ? action.retornotexto : ""}
                    >
                      <p className="truncate hover:text-clip">
                        {action.retornotexto}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell>{action.dayLate}</TableCell>
                  <TableCell>
                    {action.valPrinc
                      ? formatCurrencyToBRL(action.valPrinc)
                      : ""}
                  </TableCell>
                  <TableCell>
                    {action.pecld ? formatCurrencyToBRL(action.pecld) : ""}
                  </TableCell>
                  <TableCell className="max-w-32 md:max-w-40 lg:max-w-48">
                    <Tooltips message={`${action.typeAction}`}>
                      <p className="truncate hover:text-clip">{`${action.typeAction}`}</p>
                    </Tooltips>
                  </TableCell>
                  <TableCell className="max-w-32 md:max-w-48 lg:max-w-64">
                    <Tooltips message={`${action.user}`}>
                      <p className="truncate hover:text-clip">{`${action.user}`}</p>
                    </Tooltips>
                  </TableCell>
                  <TableCell>
                    <Button asChild className="mx-1">
                      <Link href={`/operation/clients/details/${action.codCredorDesRegis}`}>
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
  );
}
