"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CardAction from "./CardAction";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { FaPlus, FaRegClock } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateToBR, formatStringToCpfCnpj } from "@/app/lib/utils";
import {
  IClient,
  IContact,
  IContract,
} from "@/app/(easycob)/interfaces/clients";
import { TabsContacts } from "./TabsContacts";
import { IAction, ITypeAction } from "@/app/(easycob)/interfaces/actions";
import FormNegotiation from "./forms/FormNegotiation";
import { useState } from "react";
import TableContracts from "./TableContracts";
import { IMeta } from "@/app/interfaces/pagination";
import FormPromise from "./forms/FormPromise";
import FormSimple from "./forms/FormSimple";
import { fetchActionsClient } from "../../../service/actions";
import { fetchContacts } from "../../../service/contacts";
import { GoAlert } from "react-icons/go";

export function AlertCpc() {
  return (
    <div className="flex text-red-500">
      <span className="pt-1 pl-2">
        <GoAlert />
      </span>
      <span className="pl-2">Não existe contato CPC.</span>
    </div>
  );
}

export default function ConteinerDetails({
  client,
  contacts: c,
  actions: a,
  contracts,
  typesActions,
}: {
  client: IClient;
  contacts: { phones: IContact[]; emails: IContact[] };
  actions: IAction[];
  contracts: {
    meta: IMeta;
    data: IContract[];
  };
  typesActions: ITypeAction[];
}) {
  const [selectTypeAction, setSelectTypeAction] = useState<ITypeAction | null>(
    null
  );

  const [selectContract, setSelectContract] = useState<IContract | null>(null);

  const [selectContact, setSelectContact] = useState<IContact | null>(null);

  const [actions, setActions] = useState(a);

  const [contacts, setContacts] = useState(c);

  const refreshActions = async () => {
    fetchActionsClient(`${client.codCredorDesRegis}`).then((records) => {
      setActions(records);
    });
  };

  const refreshContacts = async () => {
    fetchContacts(`${client.codCredorDesRegis}`).then((records) => {
      setContacts(records);
    });
  };

  const handleChangeTypeAction = (value: string) => {
    setSelectTypeAction(
      typesActions.find((ta) => ta.id === Number(value)) || null // Retorna o primeiro ou null se não encontrar
    );
  };

  const checkCpc = () => {
    for (const phone of contacts.phones) {
      if (phone.cpc) {
        return true;
      }
    }
    return false;
  };

  const checkPrerequisites = (): boolean => {
    if (!selectTypeAction || !selectContact || !selectContract) {
      console.log("falta alguem")
      return false;
    }

    if (selectTypeAction.commissioned < 2) {
      console.log(selectTypeAction.commissioned)
      return true;
    }

    return checkCpc();
  };

  const renderFormComponent = () => {
    if (!checkPrerequisites()) return null;

    switch (selectTypeAction?.id) {
      case 1:
        return (
          <FormPromise
            client={client}
            typeAction={selectTypeAction}
            contract={selectContract}
            contact={selectContact}
            refresh={refreshActions}
          />
        );
      case 3:
        return (
          <FormNegotiation
            client={client}
            typeAction={selectTypeAction}
            contract={selectContract}
            contact={selectContact}
            refresh={refreshActions}
          />
        );
      default:
        return (
          <FormSimple
            client={client}
            typeAction={selectTypeAction}
            contract={selectContract}
            contact={selectContact}
            refresh={refreshActions}
          />
        );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do cliente</CardTitle>
          <CardDescription>Status: {client.status}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {client.nomClien}
            </p>
            {client.desCpf && (
              <p className="text-sm text-muted-foreground">
                CFP/CNPJ: {formatStringToCpfCnpj(client.desCpf)}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Endereço: {client.desEnderResid}, {client.desNumerResid},{" "}
              {client.desComplResid}
            </p>
            <p className="text-sm text-muted-foreground">
              Bairro: {client.desBairrResid}
            </p>
            <p className="text-sm text-muted-foreground">
              Cidade: {client.desCidadResid} - {client.desEstadResid}
            </p>
            <TabsContacts
              constacts={contacts}
              selectContact={selectContact}
              setSelectContact={setSelectContact}
              refresh={refreshContacts}
              codCredorDesRegis={client.codCredorDesRegis}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p>Atualizado em: {formatDateToBR(`${client.dtUpdate}`)} </p>
          {!checkCpc() && <AlertCpc />}
        </CardFooter>
      </Card>

      <Card className="grid grid-cols-1 content-between">
        <CardHeader>
          <CardTitle>Último acionamento válido</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>

        <CardContent>
          {actions.length > 0 && <CardAction action={actions[0]} />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Select onValueChange={handleChangeTypeAction}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecione um tipo de acionamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {typesActions?.map((type) => (
                  <SelectItem key={type.id} value={`${type.id}`}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {checkPrerequisites() ? (
            renderFormComponent()
          ) : (
            <Button
              disabled
              className={`${buttonVariants({ variant: "default" })} flex`}
            >
              <span className="lg:mr-2">
                <FaPlus />
              </span>
              <span className="hidden lg:block">Novo acionamento</span>
            </Button>
          )}

          <Sheet>
            <SheetTrigger
              className={`${buttonVariants({ variant: "default" })} flex`}
            >
              <span className="mr-2">
                <FaRegClock />
              </span>
              <span>Histórico</span>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Histórico de acionamentros</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[96vh]">
                {actions.map((action) => (
                  <CardAction key={action.id} action={action} />
                ))}
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </CardFooter>
      </Card>

      <TableContracts
        contracts={contracts}
        codCredorDesRegis={`${client.codCredorDesRegis}`}
        selectContract={selectContract}
        setSelectContract={setSelectContract}
      />
    </>
  );
}
