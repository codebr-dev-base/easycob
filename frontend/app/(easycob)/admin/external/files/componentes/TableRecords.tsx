"use client";
import { IMeta, IPaginationResponse, IQueryPaginationParams } from "@/app/interfaces/pagination";
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
import {
  formatCurrencyToBRL,
} from "@/app/lib/utils";
import { IFile, IQueryFileParams } from "../interfaces/files";
import { fi } from 'date-fns/locale';

export default function TableRecords({
  files,
  refresh,
  query,
  pending,
}: {
  files: IPaginationResponse<IFile>;
  refresh: (newParams: Partial<IQueryFileParams>) => void;
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
            rows={files.meta && files.meta.perPage ? files.meta.perPage : query.perPage}
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
                    columnName="Nome do Arquivo"
                    fieldName="name"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Cliente Novos"
                    fieldName="newContract"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Cliente Atualizados"
                    fieldName="updateContract"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Cliente Inativados"
                    fieldName="disableContract"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Número de Linhas"
                    fieldName="lines"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Total débitos"
                    fieldName="monetary"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.data.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.id}</TableCell>
                  <TableCell className="max-w-28 md:max-w-36 lg:max-w-48">
                    {file.fileName}
                  </TableCell>
                  <TableCell>
                    {file.newContract ? file.newContract : "-"}
                  </TableCell>
                  <TableCell>
                    {file.updateContact ? file.updateContact : "-"}
                  </TableCell>
                  <TableCell>
                    {file.disableContract ? file.disableContract : "-"}
                  </TableCell>
                  <TableCell>
                    {file.lines ? file.lines : "-"}
                  </TableCell>
                  <TableCell>
                    {formatCurrencyToBRL(file.monetary)
                      ? formatCurrencyToBRL(file.monetary)
                      : "-"}
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
        <Pagination meta={files.meta} query={query} refresh={refresh} />
      </CardFooter>
    </Card>
  );
}
