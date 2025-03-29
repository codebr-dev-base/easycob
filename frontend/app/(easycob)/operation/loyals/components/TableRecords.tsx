"use client";
import {
  IMeta,
  IPaginationResponse,
  IQueryPaginationParams,
} from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import Pagination from "@/app/(easycob)/components/Pagination2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable2";
import Tooltips from "@/app/(easycob)/components/Tooltips";
import { formatDateToBR } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPlus, FaUser } from "react-icons/fa";
import { ILoyal, IQueryLoyalParams } from "../interfaces/loyal";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import TableDetails from "./TableDetails";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import { check } from "../service/loyals";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchTags } from "@/app/(easycob)/admin/tags/service/tags";
import { ITag } from "../../tags/interfaces/tag";
import { attachTag, clearTags, detachTag } from "../../clients/service/clients";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LuTag } from "react-icons/lu";
import { sl, ta } from "date-fns/locale";
import { ContainerContactFone } from "../../clients/components/ContainerContactFone";
import { get } from "http";
import { getUser } from "@/app/lib/auth";

function FormTag({
  client,
  set,
  tags,
}: {
  client: ILoyal;
  set: Dispatch<SetStateAction<IPaginationResponse<ILoyal> | null>>;
  tags: ITag[];
}) {
  const [selectedTag, setSelectedTag] = useState<string | null>();
  const user = getUser();

  const handleTagSelect = async (codCredorDesRegis: string | bigint) => {
    try {
      if (selectedTag) {
        const t = tags.find((tag) => tag.id === parseInt(selectedTag));
        if (t) {
          await attachTag(codCredorDesRegis, selectedTag);
          set((prevTags) => {
            if (!prevTags) return prevTags;
            const loyals = prevTags?.data;
            const updatedLoyal = loyals?.map((loyal) => {
              if (loyal.codCredorDesRegis === codCredorDesRegis) {
                return {
                  ...loyal,
                  tagName: t.name,
                  tagColor: t.color,
                  tags: [
                    { ...t, user: user?.name },
                    ...(loyal.tags ? loyal.tags : []),
                  ],
                };
              }
              return loyal;
            });
            return {
              ...prevTags,
              data: updatedLoyal,
            };
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
        <Button
          className="rounded-full p-1 text-sm w-10 h-10"
          style={
            client.tagColor ? { backgroundColor: client.tagColor } : undefined
          }
        >
          {client.tags && client.tags.length > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{client.tags[0].initials}</TooltipTrigger>
                <TooltipContent>
                  <p>{client.tags[0].user}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <LuTag />
          )}
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
          <Button
            onClick={() => handleTagSelect(client.codCredorDesRegis)}
            className="rounded-full px-3"
          >
            <FaPlus />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function TableRecords({
  loyals,
  query,
  refresh,
  pending,
  setLoyals,
}: {
  loyals: IPaginationResponse<ILoyal> | null;
  query: IQueryPaginationParams;
  refresh: (newParams: Partial<IQueryLoyalParams>) => void;
  pending: boolean;
  setLoyals: Dispatch<SetStateAction<IPaginationResponse<ILoyal> | null>>;
}) {
  const [selectLoyal, setSelectLoyal] = useState<ILoyal | null>(null);
  const [tags, setTags] = useState<ITag[]>([]);

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

  const handleDeleteTag = async (
    codCredorDesRegis: string | number,
    id: number
  ) => {
    await detachTag(codCredorDesRegis, id);

    const newTags = tags.filter((tag) => tag.id !== id);
    setTags(newTags);
  };

  const handleClearTags = async (codCredorDesRegis: string | number) => {
    await clearTags(codCredorDesRegis);
    setTags([]);
  };

  const handleSelectLoyal = (loyal: ILoyal) => {
    if (selectLoyal && selectLoyal.id === loyal.id) {
      setSelectLoyal(null);
    } else {
      setSelectLoyal(loyal);
    }
  };

  const setColorRow = (loyal: ILoyal) => {
    if (loyal.classSitcontr === "ATIVO") {
      return "";
    }

    if (loyal.classSitcontr === "PENDENTE") {
      return "text-red-400";
    }

    if (loyal.classSitcontr === "ENCERRADO") {
      return "text-slate-400";
    }
    return "";
  };

  return (
    <Card>
      <CardContent>
        {pending ? (
          <div
            className={`inset-0 transition-opacity duration-1000 ${
              pending ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <SkeletonTable
              rows={loyals ? loyals.meta.perPage : query.perPage}
            />
          </div>
        ) : (
          <div
            className={`transition-opacity duration-1000 ${
              pending ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead>
                    <HeaderTable
                      columnName="Dt. U. acion."
                      fieldName="lastAction"
                      query={query}
                      refresh={refresh}
                    />
                  </TableHead>
                  <TableHead>U. acion.</TableHead>
                  <TableHead>
                    <HeaderTable
                      columnName="Unidade"
                      fieldName="unidade"
                      query={query}
                      refresh={refresh}
                    />
                  </TableHead>
                  <TableHead>
                    <HeaderTable
                      columnName="Nome do Cliente"
                      fieldName="nomClien"
                      query={query}
                      refresh={refresh}
                    />
                  </TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>
                    <HeaderTable
                      columnName="Contrato"
                      fieldName="desContr"
                      query={query}
                      refresh={refresh}
                    />
                  </TableHead>
                  <TableHead>
                    <HeaderTable
                      columnName="Faixa de Tempo"
                      fieldName="faixaTempo"
                      query={query}
                      refresh={refresh}
                    />
                  </TableHead>
                  <TableHead>
                    <HeaderTable
                      columnName="Faixa de Valor"
                      fieldName="faixaValor"
                      query={query}
                      refresh={refresh}
                    />
                  </TableHead>
                  <TableHead>
                    <HeaderTable
                      columnName="Faixa de Títulos"
                      fieldName="faixaTitulos"
                      query={query}
                      refresh={refresh}
                    />
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loyals &&
                  loyals.data.map((loyal) => (
                    <Fragment key={loyal.id}>
                      <TableRow className={setColorRow(loyal)}>
                        <TableCell
                          onClick={() => {
                            handleSelectLoyal(loyal);
                          }}
                          className={`hover:cursor-pointer ${
                            !loyal.tagColor
                              ? "bg-slate-100"
                              : "text-primary-foreground"
                          } }`}
                          style={
                            loyal.tagColor
                              ? { backgroundColor: loyal.tagColor }
                              : undefined
                          }
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {selectLoyal && selectLoyal.id === loyal.id ? (
                                  <FaCaretUp />
                                ) : (
                                  <FaCaretDown />
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {loyal.tagName ? loyal.tagName : "Sem tag"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <FormTag client={loyal} set={setLoyals} tags={tags} />
                        </TableCell>
                        <TableCell>
                          {formatDateToBR(`${loyal.lastAction}`)}
                        </TableCell>
                        <TableCell className="max-w-2  md:max-w-28 lg:max-w-36">
                          <Tooltips
                            message={
                              loyal.lastActionName ? loyal.lastActionName : ""
                            }
                          >
                            <p className="truncate hover:text-clip">
                              {loyal.lastActionName}
                            </p>
                          </Tooltips>
                        </TableCell>
                        <TableCell>{loyal.unidade}</TableCell>
                        <TableCell className="max-w-28 md:max-w-36 lg:max-w-48">
                          <Tooltips
                            message={loyal.nomClien ? loyal.nomClien : ""}
                          >
                            <p className="truncate hover:text-clip">
                              {loyal.nomClien}
                            </p>
                          </Tooltips>
                        </TableCell>
                        <TableCell>
                          {loyal.phones && Array.isArray(loyal.phones) && (
                            <ContainerContactFone contacts={loyal.phones} />
                          )}
                        </TableCell>
                        <TableCell>{loyal.desContr}</TableCell>
                        <TableCell>{loyal.faixaTempo}</TableCell>
                        <TableCell>{loyal.faixaValor}</TableCell>
                        <TableCell>{loyal.faixaTitulos}</TableCell>
                        <TableCell>
                          <Button asChild className="mx-1">
                            <Link
                              href={`/operation/clients/details/${loyal.codCredorDesRegis}`}
                            >
                              <FaUser />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        className={
                          !!selectLoyal && selectLoyal.id === loyal.id
                            ? ""
                            : "hidden"
                        }
                      >
                        <TableCell colSpan={12}>
                          <TableDetails loyal={loyal} />
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter
        className={`flex justify-end transition-opacity duration-1000 ${
          pending ? "opacity-0 hidden" : "opacity-100"
        }`}
      >
        {loyals && (
          <Pagination meta={loyals.meta} query={query} refresh={refresh} />
        )}
      </CardFooter>
    </Card>
  );
}
