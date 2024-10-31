import { IInvoice } from "@/app/(easycob)/interfaces/clients";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calcDaylate, formatCurrencyToBRL } from "@/app/lib/utils";

export default function TableInvoices({ invoices }: { invoices: IInvoice[] }) {
  return (
    <div className="flex justify-end w-full">
      <div className="w-1/2">
        <Table>
          <TableCaption>Parcelas</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>D. de Atraso</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Valor Pago</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{calcDaylate(`${invoice.datVenci}`)}</TableCell>
                <TableCell>
                  {formatCurrencyToBRL(`${invoice.valPrinc}`)}
                </TableCell>
                <TableCell>
                  {formatCurrencyToBRL(`${invoice.valPago}`)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
