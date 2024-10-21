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
import { IClient } from "@/app/(easycob)/interfaces/clients";
import { ContainerContactFone } from "./ContainerContactFone";
import { ContainerContactEmail } from "./ContainerContactEmail";

export default function TableRecords({
  meta,
  data,
  refresh,
  query,
  pending,
}: {
  meta: IMeta;
  data: IClient[];
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
                    columnName="Nome"
                    fieldName="nomClien"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="CPF/CNPJ"
                    fieldName="desCpf"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Contratos"
                    fieldName="desContr"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
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
                    columnName="Telefone"
                    fieldName="phone"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Email"
                    fieldName="email"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="max-w-28 md:max-w-36 lg:max-w-48">
                    <Tooltips message={client.nomClien ? client.nomClien : ""}>
                      <p className="truncate hover:text-clip">
                        {client.nomClien}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell>{formatStringToCpfCnpj(client.desCpf)}</TableCell>
                  <TableCell>
                    {client.contracts && client.contracts.length > 0
                      ? `${client.contracts[0].desContr}`
                      : ""}
                  </TableCell>
                  <TableCell>{client.status}</TableCell>
                  <TableCell>
                    {client.phones && Array.isArray(client.phones) && (
                      <ContainerContactFone contacts={client.phones} />
                    )}
                  </TableCell>
                  <TableCell>
                    {client.emails && Array.isArray(client.emails) && (
                      <ContainerContactEmail contacts={client.emails} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild className="mx-1">
                      <Link
                        href={`/operation/clients/details/${client.codCredorDesRegis}`}
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
        <Pagination meta={meta} query={query} refresh={refresh} />
      </CardFooter>
    </Card>
  );
}
