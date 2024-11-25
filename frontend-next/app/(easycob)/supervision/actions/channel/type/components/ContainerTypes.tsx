"use client";
import { useState } from "react";
import { IMeta } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import { fetchUserAndTypes, query } from "../../../service/actions";
import Header from "@/app/(easycob)/components/Header";
import FilterPus from "../../../components/FilterPus";
import { IUserAndTypesData } from "../../../interfaces/action";
import TableRecords from "./TableRecords";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ITypeAction } from "../../../../../interfaces/actions";

export default function ContainerTypes({
  usersAndTypes,
}: {
  usersAndTypes: IUserAndTypesData[];
}) {
  const [records, setRecords] = useState<IUserAndTypesData[]>(usersAndTypes);
  const [pending, setPending] = useState<boolean>(false);
  const [type, setType] = useState<string>("GEN");

  const refresh = async () => {
    setPending(true);

    const r = await fetchUserAndTypes();
    setRecords(r);
    setPending(false);
  };

    // Lista com todas as abreviações de acionamentos possíveis
    const actionTypesGeral: ITypeAction[] = [
      {
        id: 1,
        abbreviation: "ACV",
        name: "ACORDO A VISTA",
        commissioned: 3,
        type: "promise",
        timelife: 8,
        categoryActionId: 1,
      },
      {
        id: 3,
        abbreviation: "ACP",
        name: "ACORDO PARCELADO",
        commissioned: 3,
        type: "negotiation",
        timelife: 8,
        categoryActionId: 1,
      },
      {
        id: 2,
        abbreviation: "ACA",
        name: "ACORDO A VISTA AGENDADO (PROMESSA)",
        commissioned: 2,
        type: "simple",
        timelife: 8,
        categoryActionId: 1,
      },
      {
        id: 14,
        abbreviation: "SMS",
        name: "ENVIO DE SMS",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 18,
        abbreviation: "EME",
        name: "E-MAIL ENVIADO",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 15,
        abbreviation: "URA",
        name: "URA",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 16,
        abbreviation: "ZAP",
        name: "WHATSAPP",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 19,
        abbreviation: "CAL",
        name: "CALL ME BACK",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 37,
        abbreviation: "CAL",
        name: "CLIENTE PEDE QUE ENTRE EM CONTATO COM TERCEIRO RES",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 38,
        abbreviation: "CAL",
        name: "QUEDA DE LIGAÇÃO",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
    ];
  
    const actionTypesAlerta: ITypeAction[] = [
      {
        id: 17,
        abbreviation: "ALE",
        name: "ALERTA",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
  
      {
        id: 25,
        abbreviation: "ALE",
        name: "AGESPISA - SOLICITOU CORTE",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 26,
        abbreviation: "ALE",
        name: "ALEGA ACIONAMENTO JURÍDICO ENTRE AS PARTES",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 27,
        abbreviation: "ALE",
        name: "CLIENTE ENTRAR EM CONTATO COM AEGEA",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 28,
        abbreviation: "ALE",
        name: "COBRANÇA INDEVIDA DE CORTE A PEDIDO",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 29,
        abbreviation: "ALE",
        name: "ENVIO DE BOLETO",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 30,
        abbreviation: "ALE",
        name: "INFORMA QUE VAI NA AGENCIA",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 31,
        abbreviation: "ALE",
        name: "NECESSIDADE DE VISTORIA CADASTRAL",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 32,
        abbreviation: "ALE",
        name: "RECADO COM FAMILIAR",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 33,
        abbreviation: "ALE",
        name: "SEM DEBITO",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 34,
        abbreviation: "ALE",
        name: "SEM INTERESSE",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 35,
        abbreviation: "ALE",
        name: "VERIFICAR INFORMAÇÃO NO CREDOR",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 36,
        abbreviation: "ALE",
        name: "VISTORIA DE CONSUMO",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
  
      {
        id: 43,
        abbreviation: "ALE",
        name: "ALEGA USO DE POÇO",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 44,
        abbreviation: "ALE",
        name: "NÃO RESIDE MAIS NO IMÓVEL.",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 45,
        abbreviation: "ALE",
        name: "CONSUMO FIXO. ",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 46,
        abbreviation: "ALE",
        name: "DISCORDA DA COBRANÇA POR SER PRESCRITA. ",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 47,
        abbreviation: "ALE",
        name: "AGUARDANDO AUTORIZAÇÃO AEGEA",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
      {
        id: 48,
        abbreviation: "ALE",
        name: "CLIENTE NÃO ACEITA NORMATIVA",
        commissioned: 1,
        type: "simple",
        timelife: 4,
        categoryActionId: 2,
      },
    ];
  
    const actionTypesNot: ITypeAction[] = [
      {
        id: 4,
        abbreviation: "CSA",
        name: "CONTATO REALIZADO SEM ACORDO",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 5,
        abbreviation: "SCP",
        name: "SEM CONDIÇÕES DE PAGAR",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 6,
        abbreviation: "DEF",
        name: "CLIENTE DESCONHECE DEBITO",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 7,
        abbreviation: "APC",
        name: "ALEGA PAGAMENTO",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 8,
        abbreviation: "AJE",
        name: "ALEGA JUROS ELEVADOS",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 9,
        abbreviation: "REC",
        name: "SOMENTE RECADO",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 10,
        abbreviation: "CLA",
        name: "CLIENTE AUSENTE",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 11,
        abbreviation: "FAL",
        name: "FALECIDO - ÓBITO",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 13,
        abbreviation: "RLI",
        name: "RETORNAR LIGAÇÃO",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 20,
        abbreviation: "FAX",
        name: "SECRETARIA ELETRONICA",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 21,
        abbreviation: "FNA",
        name: "FONE NÃO ATENDE",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 22,
        abbreviation: "FOC",
        name: "TELEFONE OCUPADO",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 23,
        abbreviation: "LMD",
        name: "LIGAÇÃO MUDA",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 24,
        abbreviation: "TEI",
        name: "TELEFONE INVÁLIDO",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 39,
        abbreviation: "CLA",
        name: "NAO PERTENCE AO TITULAR",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 40,
        abbreviation: "FAL",
        name: "SEM TELEFONE PARA CONTATO",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 41,
        abbreviation: "FAX",
        name: "CAIXA POSTAL",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 42,
        abbreviation: "FNC",
        name: "CONTATO INEXISTENTE",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
      {
        id: 12,
        abbreviation: "FNC",
        name: "TELEFONE ERRADO",
        commissioned: 0,
        type: "simple",
        timelife: 1,
        categoryActionId: 3,
      },
    ];

  return (
    <article className="max-w-full">
      <div className="p-2">
        <Header title="Acionamentos">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FilterPus query={query} refresh={refresh} />
          </div>
        </Header>
      </div>

      <main className="p-2">
        <Tabs defaultValue="GEN" className="w-full">
          <TabsList className="flex justify-center bg-white rounded-lg border">
            <TabsTrigger value="GEN" className="TabsTrigger">
              Geral
            </TabsTrigger>
            <TabsTrigger value="ALE" className="TabsTrigger">
              Alertas
            </TabsTrigger>
            <TabsTrigger value="NOT" className="TabsTrigger">
              Não comissionados
            </TabsTrigger>
          </TabsList>
          <TabsContent value="GEN">
            <TableRecords userData={records} actionTypes={actionTypesGeral} />
          </TabsContent>
          <TabsContent value="ALE">
            <TableRecords userData={records} actionTypes={actionTypesAlerta} />
          </TabsContent>
          <TabsContent value="NOT">
            <TableRecords userData={records} actionTypes={actionTypesNot} />
          </TabsContent>
        </Tabs>
      </main>
    </article>
  );
}
