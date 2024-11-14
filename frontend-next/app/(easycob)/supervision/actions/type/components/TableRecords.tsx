import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUserAndTypesData } from "../../interfaces/action";

import Tooltips from "@/app/(easycob)/components/Tooltips";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      id: 4,
      abbreviation: "CSA",
      name: "CONTATO REALIZADO SEM ACORDO",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 5,
      abbreviation: "SCP",
      name: "SEM CONDIÇÕES DE PAGAR",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 6,
      abbreviation: "DEF",
      name: "CLIENTE DESCONHECE DEBITO",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 7,
      abbreviation: "APC",
      name: "ALEGA PAGAMENTO",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 8,
      abbreviation: "AJE",
      name: "ALEGA JUROS ELEVADOS",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 9,
      abbreviation: "REC",
      name: "SOMENTE RECADO",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 10,
      abbreviation: "CLA",
      name: "CLIENTE AUSENTE",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 11,
      abbreviation: "FAL",
      name: "FALECIDO - ÓBITO",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 12,
      abbreviation: "FNC",
      name: "TELEFONE ERRADO",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 13,
      abbreviation: "RLI",
      name: "RETORNAR LIGAÇÃO",
      commissioned: 0,
      cor: "#D3D3D3",
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
      id: 20,
      abbreviation: "FAX",
      name: "SECRETARIA ELETRONICA",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 21,
      abbreviation: "FNA",
      name: "FONE NÃO ATENDE",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 22,
      abbreviation: "FOC",
      name: "TELEFONE OCUPADO",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 23,
      abbreviation: "LMD",
      name: "LIGAÇÃO MUDA",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 24,
      abbreviation: "TEI",
      name: "TELEFONE INVÁLIDO",
      commissioned: 0,
      cor: "#D3D3D3",
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
    {
      id: 39,
      abbreviation: "CLA",
      name: "NAO PERTENCE AO TITULAR",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 40,
      abbreviation: "FAL",
      name: "SEM TELEFONE PARA CONTATO",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 41,
      abbreviation: "FAX",
      name: "CAIXA POSTAL",
      commissioned: 0,
      cor: "#D3D3D3",
    },
    {
      id: 42,
      abbreviation: "FNC",
      name: "CONTATO INEXISTENTE",
      commissioned: 0,
      cor: "#D3D3D3",
    },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <th>Nome do Usuário</th>
          {actionTypes.map((actionType) => (
            <th key={actionType.id} className="w-auto p-2 text-center align-top transform rotate-90 origin-top-left whitespace-nowrap">
                {actionType.name}
            </th>
          ))}
          <th className="w-auto p-2 text-center align-top transform rotate-90 origin-top-left whitespace-nowrap">Total</th>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userData.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.userName.slice(0, 8) + "..."}</TableCell>
            {actionTypes.map((type) => {
              const action = user.actions.find(
                (a) => a.typeActionId === type.id
              );
              return (
                <TableCell key={type.id}>
                  {action ? action.quant : 0}
                </TableCell>
              );
            })}
            <TableCell>{user.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
