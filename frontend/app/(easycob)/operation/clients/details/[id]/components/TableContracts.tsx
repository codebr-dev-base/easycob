"use client";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import { IContract, IInvoice } from "@/app/(easycob)/interfaces/clients";
import { IMeta } from "@/app/interfaces/pagination";
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
import { Fragment, useState } from "react";
import { fetchContracts, query } from "../../../service/contracts";
import Pagination from "@/app/(easycob)/components/Pagination";
import {
  calcDaylate,
  formatCurrencyToBRL,
  formatDateToBR,
} from "@/app/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { da } from "date-fns/locale";
import TableInvoices from "./TableInvoices";
import { fetchInvoices } from "../../../service/invoices";

export default function TableContracts({
  contracts: c,
  codCredorDesRegis,
  selectContract,
  setSelectContract,
}: {
  contracts: {
    meta: IMeta;
    data: IContract[];
  };
  codCredorDesRegis: string;
  selectContract: IContract | null;
  setSelectContract: (value: IContract | null) => void;
}) {
  const [meta, setMeta] = useState(c.meta);
  const [data, setData] = useState(c.data);
  const [pending, setPending] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);

  const refresh = async () => {
    setPending(true);

    const [records] = await Promise.all([fetchContracts(codCredorDesRegis)]);

    setMeta(records.meta);
    setData(records.data);
    setPending(false);
  };

  const handleChangeStatus = (value: string) => {
    query.status = value;
    refresh();
  };

  const handleSelectContract = (contract: IContract) => {
    if (selectContract && selectContract.id === contract.id) {
      setSelectContract(null);
      setInvoices([]);
    } else {
      setSelectContract(contract);
      fetchInvoices(contract.codCredorDesRegis, [contract.desContr]).then(
        (data) => {
          setInvoices(data);
        }
      );
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Contratos</CardTitle>
        <RadioGroup
          defaultValue={query.status}
          className="flex"
          onValueChange={handleChangeStatus}
        >
          <Label className="flex items-center space-x-2">
            <RadioGroupItem value="ATIVO" />
            <span>Ativo</span>
          </Label>
          <Label className="flex items-center space-x-2">
            <RadioGroupItem value="INATIVO" />
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
                <TableHead>Status</TableHead>
                {data.length > 0 && data[0].codCredor == "8" && (
                  <TableHead>Carteira</TableHead>
                )}

                <TableHead>Contrato</TableHead>
                <TableHead>V. Aberto</TableHead>
                <TableHead>P. Abertas</TableHead>
                <TableHead>V. Pago</TableHead>
                <TableHead>P. Pagas</TableHead>
                <TableHead>D. de Atraso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((contract) => (
                <Fragment key={contract.id}>
                  <TableRow>
                    <TableCell>
                      <Switch
                        checked={
                          !!selectContract && selectContract.id === contract.id
                        }
                        onCheckedChange={() => {
                          handleSelectContract(contract);
                        }}
                      />
                    </TableCell>
                    <TableCell>{contract.status}</TableCell>
                    {contract.codCredor == "8" && (
                      <TableCell>
                        {contract.isFixa && !contract.isVar && (
                          <span>Fixa</span>
                        )}
                        {!contract.isFixa && contract.isVar && (
                          <span>Variavel</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell>{contract.desContr}</TableCell>
                    <TableCell>
                      {formatCurrencyToBRL(contract.valPrinc)}
                    </TableCell>
                    <TableCell>{contract.countPrinc}</TableCell>
                    <TableCell>
                      {formatCurrencyToBRL(contract.valPago)}
                    </TableCell>
                    <TableCell>{contract.countPago}</TableCell>
                    <TableCell>{calcDaylate(`${contract.datVenci}`)}</TableCell>
                  </TableRow>
                  <TableRow
                    className={
                      !!selectContract && selectContract.id === contract.id
                        ? ""
                        : "hidden"
                    }
                  >
                    <TableCell
                      colSpan={
                        data.length > 0 && data[0].codCredor == "8" ? 9 : 8
                      }
                    >
                      <TableInvoices invoices={invoices}/>
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
