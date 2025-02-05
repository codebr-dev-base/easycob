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
import { ILoyal } from "../interfaces/loyal";
import Tooltips from "@/app/(easycob)/components/Tooltips";

export default function TableInvoices({ loyal }: { loyal: ILoyal }) {
  return (
    <div className="flex justify-end w-full">
      <div className="w-4/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>U. acion.</TableHead>
              <TableHead>Sit. do Contrato</TableHead>
              <TableHead>T. Cliente</TableHead>
              <TableHead>D. de Venc.</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Q. de Títulos</TableHead>
              <TableHead>BKO</TableHead>
              <TableHead>Classificação de Utilização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="max-w-2  md:max-w-28 lg:max-w-36">
                <Tooltips
                  message={loyal.lastActionName ? loyal.lastActionName : ""}
                >
                  <p className="truncate hover:text-clip">
                    {loyal.lastActionName}
                  </p>
                </Tooltips>
              </TableCell>
              <TableCell>{loyal.classSitcontr}</TableCell>
              <TableCell>{loyal.tipoCliente}</TableCell>
              <TableCell>{loyal.dtVenci}</TableCell>
              <TableCell>{formatCurrencyToBRL(loyal.valor)}</TableCell>
              <TableCell>{loyal.qtdTitulos}</TableCell>
              <TableCell>{loyal.bko}</TableCell>
              <TableCell>{loyal.classUtiliz}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
