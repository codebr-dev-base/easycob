import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUserAndTypes, IUserAndTypesData } from "../../interfaces/action";

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
import { query } from "../../service/actions";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable";
import { RxArrowDown, RxArrowUp, RxCaretSort } from "react-icons/rx";
import { Button } from "@/components/ui/button";

export default function TableRecords({
  userData,
}: {
  userData: IUserAndTypesData[];
}) {
  // Lista com todas as abreviações de acionamentos possíveis
  const actionTypes = [
    {
      id: 1,
      abbreviation: "ACV",
      name: "ACORDO A VISTA",
      commissioned: 3,
      cor: "#FF0000",
    },
    {
      id: 2,
      abbreviation: "ACA",
      name: "ACORDO A VISTA AGENDADO (PROMESSA)",
      commissioned: 2,
      cor: "#FFFF00",
    },
    {
      id: 3,
      abbreviation: "ACP",
      name: "ACORDO PARCELADO",
      commissioned: 3,
      cor: "#FF0000",
    },
    {
      id: 14,
      abbreviation: "SMS",
      name: "ENVIO DE SMS",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 15,
      abbreviation: "URA",
      name: "URA",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 16,
      abbreviation: "ZAP",
      name: "WHATSAPP",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 17,
      abbreviation: "ALE",
      name: "ALERTA",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 18,
      abbreviation: "EME",
      name: "E-MAIL ENVIADO",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 19,
      abbreviation: "CAL",
      name: "CALL ME BACK",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 25,
      abbreviation: "ALE",
      name: "AGESPISA - SOLICITOU CORTE",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 26,
      abbreviation: "ALE",
      name: "ALEGA ACIONAMENTO JURÍDICO ENTRE AS PARTES",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 27,
      abbreviation: "ALE",
      name: "CLIENTE ENTRAR EM CONTATO COM AEGEA",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 28,
      abbreviation: "ALE",
      name: "COBRANÇA INDEVIDA DE CORTE A PEDIDO",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 29,
      abbreviation: "ALE",
      name: "ENVIO DE BOLETO",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 30,
      abbreviation: "ALE",
      name: "INFORMA QUE VAI NA AGENCIA",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 31,
      abbreviation: "ALE",
      name: "NECESSIDADE DE VISTORIA CADASTRAL",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 32,
      abbreviation: "ALE",
      name: "RECADO COM FAMILIAR",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 33,
      abbreviation: "ALE",
      name: "SEM DEBITO",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 34,
      abbreviation: "ALE",
      name: "SEM INTERESSE",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 35,
      abbreviation: "ALE",
      name: "VERIFICAR INFORMAÇÃO NO CREDOR",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 36,
      abbreviation: "ALE",
      name: "VISTORIA DE CONSUMO",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 37,
      abbreviation: "CAL",
      name: "CLIENTE PEDE QUE ENTRE EM CONTATO COM TERCEIRO RES",
      commissioned: 1,
      cor: "#00FF00",
    },
    {
      id: 38,
      abbreviation: "CAL",
      name: "QUEDA DE LIGAÇÃO",
      commissioned: 1,
      cor: "#00FF00",
    },
  ];

  const [users, setUsers] = useState(userData);

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

        console.log(actionA);
        console.log(actionB);
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
    setUsers([...userData]);
  }, userData);

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
              <TableHead className="h-12">Nome do Usuário</TableHead>
              {actionTypes.map((actionType) => {
                // Verifica se todos os valores dessa coluna são zero
                return (
                  <TableHead key={actionType.id} className="w-12 pl-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-3 h-8 p-0"
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
              <TableHead className="w-12 pl-0">
                <p>Total</p>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
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
                    <TableCell key={type.id} className={`w-12 ${action ? selectColor(action) : ""}`}>
                      {action ? action.quant : 0}
                    </TableCell>
                  );
                })}
                <TableCell className="w-12">{user.total}</TableCell>
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
