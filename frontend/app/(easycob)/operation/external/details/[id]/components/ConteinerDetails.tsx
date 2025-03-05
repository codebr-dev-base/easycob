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
import FormNegotiation from "./forms/FormNegotiation";
import { useCallback, useEffect, useState } from "react";
import FormPromise from "./forms/FormPromise";
import FormSimple from "./forms/FormSimple";
import { GoAlert } from "react-icons/go";
import { fetchTypesActions } from "@/app/(easycob)/supervision/actions/service/actions";
import { IContact, IContract } from "../../../interfaces/contracts";
import useContactService from "../../../service/use-contact-service";
import useActionService from "../../../service/use-action-service";
import { ITypeAction } from "@/app/(easycob)/interfaces/actions";
import CardContract from "./CardContract";
import { handlerError } from "@/app/lib/error";
import { AlertaDuplicate } from "./AlertaDuplicate";
import { IAction } from "../../../interfaces/actions";
import useInvoiceService from "../../../service/use-invoice-service";
import TableInvoices from "./TableInvoices";
import { IQueryPaginationParams } from "@/app/interfaces/pagination";

interface IPropsContract {
  contract: IContract;
}

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

export default function ConteinerDetails({ contract }: IPropsContract) {
  const { contacts, setContacts, createContact, updateContact } =
    useContactService({
      phones: contract.phones as IContact[],
      emails: contract.emails as IContact[],
    });
  const {
    actions,
    fetchActions,
    createAction,
    errorData,
    isLoading: isLoadingActions,
  } = useActionService();

  const {
    invoices,
    setInvoices,
    queryParams,
    setQueryParams,
    isLoading,
    error,
    fetchInvoices,
  } = useInvoiceService();

  const [selectTypeAction, setSelectTypeAction] = useState<ITypeAction | null>(
    null
  );
  const [selectContact, setSelectContact] = useState<IContact | null>(null);
  const [typesActions, setTypesActions] = useState<ITypeAction[]>([]);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicate, setDuplicate] = useState<IAction | null>(null);

  useEffect(() => {
    fetchTypesActions().then((records) => {
      if (records) {
        setTypesActions(records);
      }
    });
    fetchActions(contract.desContr);
    fetchInvoices(contract.desContr);
  }, []);

  useEffect(() => {
    if (errorData) {
      setIsDuplicate(true);
      setDuplicate(errorData as IAction);
    }
  }, [errorData]);

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
    if (!selectTypeAction || !selectContact) {
      return false;
    }

    // Adicionando a verificação do CPC
    if (selectTypeAction.cpc) {
      return checkCpc();
    }

    // Se o ID não estiver no array, retorna false ou outra lógica apropriada
    return true; // ou outra lógica, dependendo do que você precisa fazer
  };

  const renderFormComponent = () => {
    if (!checkPrerequisites()) return null;

    switch (selectTypeAction?.id) {
      case 1:
        return (
          <FormPromise
            typeAction={selectTypeAction}
            contract={contract}
            contact={selectContact}
            createAction={createAction}
            isLoading={isLoadingActions}
          />
        );
      case 2:
        return (
          <FormPromise
            typeAction={selectTypeAction}
            contract={contract}
            contact={selectContact}
            createAction={createAction}
            isLoading={isLoadingActions}
          />
        );
      case 3:
        return (
          <FormNegotiation
            contract={contract}
            typeAction={selectTypeAction}
            contact={selectContact}
            createAction={createAction}
            isLoading={isLoadingActions}
          />
        );
      default:
        return (
          <FormSimple
            typeAction={selectTypeAction}
            contract={contract}
            contact={selectContact}
            createAction={createAction}
            isLoading={isLoadingActions}
          />
        );
    }
  };

  const retryCreateAction = async () => {
    if (!duplicate) {
      return;
    }

    await createAction(duplicate);
    setDuplicate(null);
    setIsDuplicate(false);
  };

  const refresh = useCallback(
    (newParams: Partial<IQueryPaginationParams>) => {
      setQueryParams(newParams);
      fetchInvoices(contract?.desContr);
    },
    [setQueryParams, fetchInvoices]
  );

  return (
    <>
      <AlertaDuplicate
        open={isDuplicate}
        setOpen={setIsDuplicate}
        retry={retryCreateAction}
      />
      <CardContract
        contract={contract}
        contacts={contacts}
        selectContact={selectContact}
        setSelectContact={setSelectContact}
        createContact={createContact}
        updateContact={updateContact}
      >
        {!checkCpc() && <AlertCpc />}
      </CardContract>

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

      <TableInvoices
        invoices={invoices}
        refresh={refresh}
        query={queryParams.current as IQueryPaginationParams}
        isLoading={isLoading}
      />
    </>
  );
}
