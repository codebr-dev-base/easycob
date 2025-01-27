import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";

import { TbFilterPlus } from "react-icons/tb";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IUser } from "@/app/interfaces/auth";
import { IQueryActionParams, IReturnType, ISubsidiary } from "../interfaces/action";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { ChangeEvent, useEffect, useState } from "react";
import { fetchUserByModule } from "@/app/(easycob)/admin/users/service/users";
import {
  fetchReturnsTypes,
  fetchSubsidiaries,
  fetchTypesActions,
} from "../service/actions";
import { FaSearch } from "react-icons/fa";
import { DatePicker } from "@/app/(easycob)/components/DatePicker";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";

export default function FilterPus({
  query,
  refresh,
}: {
  query: IQueryActionParams;
  refresh: () => void;
}) {
  const [optsTypesActions, setOptsTypesActions] = useState<Option[]>([]);
  const [selectTypesActions, setSelectTypesActions] = useState<Option[]>([]);
  const [status, setStatus] = useState(true);
  const [operators, setOperators] = useState<IUser[]>([]);
  const [returnsTypes, setReturnsTypes] = useState<IReturnType[]>([]);
  const [wallet, setWallet] = useState<string[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<ISubsidiary[]>([]);
  const handleChangeSelectTypesActions = () => {
    const ids = selectTypesActions.map((item) => {
      return item.value;
    });
    query.typeActionIds = ids;
  };

  useEffect(() => {
    fetchUserByModule("operator", true).then((value) => {
      setOperators(value ? value : []);
    });

    const opts: Option[] = [];

    fetchTypesActions().then((resul) => {
      if (resul) {
        resul.forEach((type) => {
          opts.push({ label: type.name, value: `${type.id}` });
        });
        handleChangeSelectTypesActions();
        setOptsTypesActions(opts);
      }
    });

    fetchReturnsTypes().then((result) => {
      if (result) {
        setReturnsTypes(result);
      }
    });

    fetchSubsidiaries().then((result) => {
      if (result) {
        setSubsidiaries(result);
      }
    });
  }, []);

  useEffect(() => {
    handleChangeSelectTypesActions();
    query.page = 1;
    query.perPage = 10;
    refresh();
  }, [selectTypesActions]);

  const handleChangeOperator = (value: string) => {
    if (value == "all") {
      query.userId = "";
    } else {
      query.userId = value;
    }
    query.page = 1;
    query.perPage = 10;
    refresh();
  };

  const handleChangeSubsidiary = (value: string) => {
    console.log(value);
    if (value == "all") {
      query.nomLoja = "";
    } else {
      query.nomLoja = value;
    }
    query.page = 1;
    query.perPage = 10;
    refresh();
  };

  const handleReturnType = (value: string) => {
    if (value == "all") {
      query.returnType = "";
    } else {
      query.returnType = value;
    }
    query.page = 1;
    query.perPage = 10;
    refresh();
  };

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "keyword") {
      if (e.target.value.length > 4) {
        query.keyword = e.target.value;
        query.page = 1;
        query.perPage = 10;
        refresh();
      }
    }
  };

  const handleChangeDate = (range: DateRange) => {
    if (range.from && range.to) {
      query.startDate = range.from?.toISOString().split("T")[0];
      query.endDate = range.to?.toISOString().split("T")[0];
      query.page = 1;
      query.perPage = 10;
      refresh();
    }
  };

  const handlerWallet = (element: string) => {
    const newArray = [...wallet];
    const index = newArray.indexOf(element);

    if (index === -1) {
      // Elemento não está no array, então adiciona
      newArray.push(element);
    } else {
      // Elemento já está no array, então remove
      newArray.splice(index, 1);
    }

    if (newArray.length < 1 && query.wallet) {
      delete query.wallet;
    } else {
      query.wallet = newArray;
    }
    query.page = 1;
    query.perPage = 10;
    refresh();
    setWallet(newArray);
  };

  return (
    <Popover>
      <PopoverTrigger className={buttonVariants({ variant: "secondary" })}>
        <TbFilterPlus />
      </PopoverTrigger>
      <PopoverContent align={"end"} className="w-96">
        <Card>
          <div className="flex text-2xl px-2">
            <h3>Filtos</h3>
          </div>
          <CardContent className="p-2 space-y-2">
            <div className="flex w-full">
              <Label className="w-full">
                Por nome do cliente:
                <div className="flex">
                  <div className="bg-white flex items-center justify-center rounded rounded-r-none mt-1 p-3 border ring-offset-background group-focus:ring-2">
                    <FaSearch className="text-foreground" />
                  </div>
                  <Input
                    name="keyword"
                    placeholder="Buscar.."
                    className="rounded-l-none"
                    onChange={handleChangeKeyword}
                    defaultValue={query.keyword}
                  />
                </div>
              </Label>
            </div>
            <div className="flex">
              <Label>
                Por data de criação:
                <DatePicker
                  placeholder="Ínicio"
                  onChange={handleChangeDate}
                  defaultDate={{
                    from: query.startDate ? new Date(query.startDate) : undefined,
                    to: query.endDate ? new Date(query.endDate) : undefined,
                  }}
                />
              </Label>
            </div>
            <div className="flex">
              <Label className="w-full">
                Por operador:
                <Select onValueChange={handleChangeOperator} defaultValue={query.userId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Operador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" >Todos</SelectItem>
                    {operators.map((operator) => (
                      <SelectItem key={operator.id} value={`${operator.id}`}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>
            </div>
            <div className="flex flex-col">
              <Label>Por tipo de acionamento:</Label>

              <MultipleSelector
                value={selectTypesActions}
                onChange={setSelectTypesActions}
                defaultOptions={optsTypesActions}
                hidePlaceholderWhenSelected
                placeholder="Tipos de Acionamentos"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    nenhum resultado encontrado.
                  </p>
                }
              />
            </div>
            <div className="flex">
              <Label className="w-full">
                Por retorno do recupera:
                <Select onValueChange={handleReturnType} defaultValue={query.returnType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Retorno recupera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {returnsTypes.map((r, index) => (
                      <SelectItem key={index} value={`${r.retornotexto}`}>
                        {r.retornotexto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>
            </div>
            <div className="flex">
              <Label className="w-full">
                Unidade:
                <Select onValueChange={handleChangeSubsidiary} defaultValue={query.nomLoja}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {subsidiaries.map((subsidiary) => (
                      <SelectItem
                        key={subsidiary.nomLoja}
                        value={`${subsidiary.nomLoja}`}
                      >
                        {subsidiary.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>
            </div>
            <div>
              <label className="text-base">Carteira:</label>
            </div>
            <div className="flex p-2 space-x-2">
              <Label className="flex items-center space-x-2">
                <Checkbox
                  checked={wallet.includes("F")}
                  onCheckedChange={() => {
                    handlerWallet("F");
                  }}
                />
                <span>Fixa</span>
              </Label>
              <Label className="flex items-center space-x-2">
                <Checkbox
                  checked={wallet.includes("V")}
                  onCheckedChange={() => {
                    handlerWallet("V");
                  }}
                />
                <span>Variável</span>
              </Label>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
