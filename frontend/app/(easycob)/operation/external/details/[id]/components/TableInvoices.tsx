"use client";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import {
  IPaginationResponse,
  IQueryPaginationParams,
} from "@/app/interfaces/pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyToBRL, formatDateToBR } from "@/app/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { da } from "date-fns/locale";
import { IQueryParams } from "@/app/interfaces/fetch";
import Pagination from "@/app/(easycob)/components/Pagination2";
import { IInvoice } from "../../../interfaces/contracts";

export default function TableInvoices({
  invoices,
  refresh,
  query,
  isLoading,
}: {
  invoices: IPaginationResponse<IInvoice> | null;
  refresh: (newParams: Partial<IQueryPaginationParams>) => void;
  query: IQueryPaginationParams;
  isLoading: boolean;
}) {
  const handleChangeStatus = (value: string) => {
    refresh({ status: value, page: 1, perPage: 10 });
  };

  return (
    <>
      {invoices && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Faturas</CardTitle>
            <RadioGroup
              className="flex"
              defaultValue={query.status as string}
              onValueChange={handleChangeStatus}
            >
              <Label className="flex items-center space-x-2">
                <RadioGroupItem value="ativo" />
                <span>Ativo</span>
              </Label>
              <Label className="flex items-center space-x-2">
                <RadioGroupItem value="inativo" />
                <span>Inativo</span>
              </Label>
              <Label className="flex items-center space-x-2">
                <RadioGroupItem value="null" />
                <span>Todos</span>
              </Label>
            </RadioGroup>
          </CardHeader>
          <CardContent>
            {/* Skeleton com transiç ão de opacidade */}
            <div
              className={`inset-0 transition-opacity duration-1000 ${
                isLoading ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              <SkeletonTable
                rows={
                  invoices.meta && invoices.meta.perPage
                    ? invoices.meta.perPage
                    : (query.perPage as number)
                }
              />
            </div>
            {/* Tabela com transição de opacidade */}
            <div
              className={`transition-opacity duration-1000 ${
                isLoading ? "opacity-0 hidden" : "opacity-100"
              }`}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>D. de referência</TableHead>
                    <TableHead>D. de vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>D. de Atraso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.data.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.status}</TableCell>
                      <TableCell>{invoice.desContr}</TableCell>
                      <TableCell>{formatDateToBR(invoice.refNf)}</TableCell>
                      <TableCell>{formatDateToBR(invoice.datVenc)}</TableCell>
                      <TableCell>
                        {formatCurrencyToBRL(invoice.vlrSc)}
                      </TableCell>
                      <TableCell>{invoice.agingVencimento}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter
            className={`flex justify-end transition-opacity duration-1000 ${
              isLoading ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            <Pagination meta={invoices.meta} query={query} refresh={refresh} />
          </CardFooter>
        </Card>
      )}
    </>
  );
}
