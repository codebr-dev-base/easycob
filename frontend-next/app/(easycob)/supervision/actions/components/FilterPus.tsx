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
import { IQueryActionParams, IReturnType } from "../interfaces/action";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { ChangeEvent, useEffect, useState } from "react";
import { fetchUserByModule } from "@/app/(easycob)/admin/users/service/users";
import { fetchReturnsTypes, fetchTypesActions } from "../service/actions";
import { FaSearch } from "react-icons/fa";
import { DatePicker } from "@/app/(easycob)/components/DatePicker";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";

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
  }, []);

  useEffect(() => {
    handleChangeSelectTypesActions();
    refresh();
  }, [selectTypesActions]);

  const handleChangeOperator = (value: string) => {
    if (value == "all") {
      query.userId = "";
    } else {
      query.userId = value;
    }
    refresh();
  };

  const handleReturnType = (value: string) => {
    if (value == "all") {
      query.returnType = "";
    } else {
      query.returnType = value;
    }
    refresh();
  };

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "keyword") {
      if (e.target.value.length > 4) {
        query.keyword = e.target.value;
        refresh();
      }
    }
  };

  const handleChangeDate = (range: DateRange) => {
    if (range.from && range.to) {
      query.startDate = range.from?.toISOString().split("T")[0];
      query.endDate = range.to?.toISOString().split("T")[0];
      refresh();
    }
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
                  />
                </div>
              </Label>
            </div>
            <div className="flex">
              <Label>
                Por data de criação:
                <DatePicker placeholder="Ínicio" onChange={handleChangeDate} />
              </Label>
            </div>
            <div className="flex">
              <Label className="w-full">
                Por operador:
                <Select onValueChange={handleChangeOperator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Operador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
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
                <Select onValueChange={handleReturnType}>
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
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}