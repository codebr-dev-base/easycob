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
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import TableContracts from "./TableContracts";
import { IMeta } from "@/app/interfaces/pagination";
import FormPromise from "./forms/FormPromise";
import FormSimple from "./forms/FormSimple";
import { fetchActionsClient } from "../../../service/actions";
import { fetchContacts } from "../../../service/contacts";
import { GoAlert } from "react-icons/go";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LuTag } from "react-icons/lu";
import { fetchTypesActions } from "@/app/(easycob)/supervision/actions/service/actions";
import { ITag } from "@/app/(easycob)/admin/tags/interfaces/tag";
import {
  attachTag,
  clearTags,
  detachTag,
  fetchTagsClient,
} from "../../../service/clients";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { fi, se } from "date-fns/locale";
import { fetchTags } from "@/app/(easycob)/admin/tags/service/tags";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

function FormTag({
  client,
  set,
}: {
  client: IClient;
  set: Dispatch<SetStateAction<ITag[]>>;
}) {
  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>();

  useEffect(() => {
    fetchTags()
      .then((data: ITag[]) => {
        if (data) {
          setTags(data);
        }
      })
      .catch((error: unknown) => {
        console.error("Erro ao buscar tags:", error);
      });
  }, []);

  const handleTagSelect = async () => {
    try {
      if (selectedTag) {
        const t = tags.find((tag) => tag.id === parseInt(selectedTag));
        if (t) {
          await attachTag(client.codCredorDesRegis, selectedTag);
          set((prevTags) => {
            const newArray: ITag[] = [
              ...(new Set<ITag>([...prevTags, t]) as unknown as ITag[]),
            ];
            return newArray;
          });
        }
      }
    } catch (error) {
      console.error("Erro ao associar tag:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <LuTag />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex gap-2 justify-between">
          <Select
            onValueChange={(value) => {
              setSelectedTag(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={`${tag.id}`}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={() => handleTagSelect()}>
            <FaPlus />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default function ConteinerDetails({
  client,
  contacts: c,
  contracts,
}: {
  client: IClient;
  contacts: { phones: IContact[]; emails: IContact[] };
  contracts: {
    meta: IMeta;
    data: IContract[];
  };
}) {
  const [selectTypeAction, setSelectTypeAction] = useState<ITypeAction | null>(
    null
  );

  const [selectContract, setSelectContract] = useState<IContract | null>(null);

  const [selectContact, setSelectContact] = useState<IContact | null>(null);

  const [actions, setActions] = useState<IAction[]>([]);

  const [contacts, setContacts] = useState(c);
  const [typesActions, setTypesActions] = useState<ITypeAction[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);

  useEffect(() => {
    fetchTypesActions().then((records) => {
      if (records) {
        setTypesActions(records);
      }
    });
    fetchActionsClient(`${client.codCredorDesRegis}`).then((records) => {
      if (records) {
        setActions(records);
      }
    });
    fetchTagsClient(client.codCredorDesRegis).then((response) => {
      console.log(response);
      if (response) {
        setTags(response);
      }
    });
  }, []);

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
      return false;
    }

    // Adicionando a verificação do CPC
    if (selectTypeAction.cpc) {
      return checkCpc();
    }

    return true;
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
      case 2:
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

  const handleDeleteTag = async (id: number) => {
    await detachTag(client.codCredorDesRegis, id);

    const newTags = tags.filter((tag) => tag.id !== id);
    setTags(newTags);
  };

  const handleClearTags = async () => {
    await clearTags(client.codCredorDesRegis);
    setTags([]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              <div>Detalhes do cliente</div>
              <div className="text-base font-medium">
                <FormTag client={client} set={setTags} />
              </div>
            </div>
          </CardTitle>
          <CardDescription className="flex">
            <span>Status: {client.status}</span>
            {tags.map((tag) => (
              <TooltipProvider key={tag.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      className="ml-2 pr-0 py-0"
                      key={tag.id}
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}{" "}
                      <button
                        className="ml-2 rounded-full currsor-pointer bg-slate-200 p-0 text-slate-500 h-4 w-4 text-xs hover:text-sm"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        X
                      </button>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tag.user}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {tags.length > 0 && (
              <button
                className={badgeVariants({ variant: "secondary" })}
                onClick={() => handleClearTags()}
              >
                Limpar
              </button>
            )}
          </CardDescription>
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
