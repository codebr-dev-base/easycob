import React, { Fragment, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUserAndTypes, IUserAndTypesData } from "../../../interfaces/action";

import Tooltips from "@/app/(easycob)/components/Tooltips";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateToBR } from "@/app/lib/utils";
import { query } from "../../../service/actions";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable";
import { RxArrowDown, RxArrowUp, RxCaretSort } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { ITypeAction } from "@/app/(easycob)/interfaces/actions";

export default function TableRecords({
  userData,
  actionTypes,
}: {
  userData: IUserAndTypesData[];
  actionTypes: ITypeAction[];
}) {
  const [users, setUsers] = useState<IUserAndTypesData[]>(userData);

  const [descending, setDescending] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<number | string>("id");

  const toggleSorting = (actionId: number | string) => {
    setDescending(!descending);
    setOrderBy(actionId);
    sortUsersByAction(actionId);
  };

  // Função que verifica se todos os valores de uma coluna são 0
  const isColumnEmpty = (actionId: number) => {
    return userData.every((user) => {
      const action = user.actions.find((a) => a.typeActionId === actionId);
      return action ? action.quant === 0 : true;
    });
  };

  //const order = () => { alert(JSON.stringify(actionType))}

  /**
   * Função de ordenação para usuários com base em uma ação específica
   * @param actionId ID da ação para ordenação
   * @returns Lista ordenada de usuários
   */
  const sortUsersByAction = (actionId: number | string) => {
    setUsers(
      [...users].sort((a, b) => {
        console.log(a);
        const actionA = a.actions.find(
          (action) => action.typeActionId === actionId
        );
        const actionB = b.actions.find(
          (action) => action.typeActionId === actionId
        );

        // Usuário sem a ação especificada vai para o final/início
        if (!actionA && !actionB) return 0; // Ambos não possuem a ação
        if (!actionA) return descending ? 1 : 1; // "a" não tem a ação
        if (!actionB) return descending ? -1 : -1; // "b" não tem a ação

        // Ambos possuem a ação, comparar pelo valor de "quant"
        return descending
          ? actionA.quant - actionB.quant
          : actionB.quant - actionA.quant;
      })
    );
  };

  useEffect(() => {
    setUsers(userData);
  }, [userData]);

  const selectColor = (a: IUserAndTypes) => {
    if (a.commissioned === 3) {
      return "bg-red-100";
    }

    if (a.commissioned === 2) {
      return "bg-yellow-100";
    }

    return "bg-green-100";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acionamentos</CardTitle>
        <CardDescription>Comissionados</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2}>Nome do Usuário</TableHead>
              {actionTypes.map((actionType) => {
                // Verifica se todos os valores dessa coluna são zero
                return (
                  <TableHead
                    key={actionType.id}
                    className="pl-0 justify-center"
                    colSpan={2}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 p-0 w-full"
                            onClick={() => {
                              toggleSorting(actionType.id);
                            }}
                          >
                            {actionType.abbreviation}

                            {orderBy != actionType.id ? (
                              <RxCaretSort className="ml-2 h-4 w-4" />
                            ) : descending == false ? (
                              <RxArrowDown className="ml-2 h-4 w-4" />
                            ) : (
                              <RxArrowUp className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{actionType.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                );
              })}
              <TableHead className="pl-0" rowSpan={2}>
                <p>Total</p>
              </TableHead>
            </TableRow>
            <TableRow>
              {actionTypes.map((actionType) => {
                // Verifica se todos os valores dessa coluna são zero
                return (
                  <Fragment key={actionType.id}>
                    <TableHead className="pl-0">CPC</TableHead>
                    <TableHead className="pl-0">NCPC</TableHead>
                  </Fragment>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="max-w-32 md:max-w-40 lg:max-w-48">
                  <p className="hover:text-clip truncate">{user.userName}</p>
                </TableCell>
                {actionTypes.map((type) => {
                  // Verifica se a coluna deve ser renderizada
                  const action = user.actions.find(
                    (a) => a.typeActionId === type.id
                  );
                  return (
                    <Fragment key={type.id}>
                      <TableCell
                        className={` ${action ? selectColor(action) : ""}`}
                      >
                        {action ? action.cpc : 0}
                      </TableCell>
                      <TableCell
                        className={` ${action ? selectColor(action) : ""}`}
                      >
                        {action ? action.ncpc : 0}
                      </TableCell>
                    </Fragment>
                  );
                })}
                <TableCell className="">{user.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 font-medium leading-none">
          Perído de valiação:
        </div>
        <div className="leading-none text-muted-foreground">
          {`${formatDateToBR(query.startDate)} - ${formatDateToBR(
            query.endDate
          )}`}
        </div>
      </CardFooter>
    </Card>
  );
}
