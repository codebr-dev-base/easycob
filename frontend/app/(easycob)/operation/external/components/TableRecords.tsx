"use client";
import {
  IMeta,
  IPaginationResponse,
  IQueryPaginationParams,
} from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import Pagination from "@/app/(easycob)/components/Pagination2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable2";
import Tooltips from "@/app/(easycob)/components/Tooltips";
import { formatStringToCpfCnpj } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { IQueryContractsParams } from "../../clients/interfaces/contracts";
import { IContract } from "../interfaces/contracts";
import { ContainerContactEmail } from "../../clients/components/ContainerContactEmail";
import { ContainerContactFone } from "../../clients/components/ContainerContactFone";

export default function TableRecords({
  contracts,
  refresh,
  query,
  pending,
}: {
  contracts: IPaginationResponse<IContract>;
  refresh: (newParams: Partial<IQueryContractsParams>) => void;
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
            rows={
              contracts.meta && contracts.meta.perPage
                ? contracts.meta.perPage
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
                    columnName="Nome"
                    fieldName="nomCliente"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="CPF/CNPJ"
                    fieldName="numDoc1"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>

                <TableHead>
                  <HeaderTable
                    columnName="Perfil"
                    fieldName="comportamentoArrecadacao6M"
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
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.data.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.desContr}</TableCell>

                  <TableCell className="max-w-28 md:max-w-36 lg:max-w-48">
                    <Tooltips
                      message={contract.nomCliente ? contract.nomCliente : ""}
                    >
                      <p className="truncate hover:text-clip">
                        {contract.nomCliente}
                      </p>
                    </Tooltips>
                  </TableCell>
                  <TableCell>
                    {formatStringToCpfCnpj(contract.numDoc1)}
                  </TableCell>
                  <TableCell>{contract.comportamentoArrecadacao6M}</TableCell>
                  <TableCell>{contract.status}</TableCell>
                  <TableCell>
                    {contract.phones && Array.isArray(contract.phones) && (
                      <ContainerContactFone contacts={contract.phones} />
                    )}
                  </TableCell>
                  <TableCell>
                    {contract.emails && Array.isArray(contract.emails) && (
                      <ContainerContactEmail contacts={contract.emails} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild className="mx-1">
                      <Link
                        href={`/operation/external/details/${contract.desContr}`}
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
        <Pagination meta={contracts.meta} query={query} refresh={refresh} />
      </CardFooter>
    </Card>
  );
}
