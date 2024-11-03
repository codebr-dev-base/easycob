import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";

import { TbFilterPlus } from "react-icons/tb";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { IQueryClienteParams } from "../interfaces/cliente";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function FilterPus({
  query,
  refresh,
}: {
  query: IQueryClienteParams;
  refresh: () => void;
}) {
  const [isFixa, setIsFixa] = useState(false);
  const [isVar, setIsVar] = useState(false);

  useEffect(() => {
    if (query.isFixa) {
      setIsFixa(true);
    }

    if (query.isVar) {
      setIsVar(true);
    }
  }, [query]);
  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "keyword") {
      query.keyword = e.target.value;
      query.page = 1;
      query.perPage = 10;
      refresh();
      /*       switch (query.keywordColumn) {
        case "nomClien":
          if (e.target.value.length > 4) {
            query.page = 1;
            query.perPage = 10;
            refresh();
          }
          break;
        case "phone":
          if (e.target.value.length > 8) {
            query.page = 1;
            query.perPage = 10;
            refresh();
          }
          break;
        case "email":
          if (e.target.value.length > 6) {
            query.page = 1;
            query.perPage = 10;
            refresh();
          }
          break;
        case "desContr":
          if (e.target.value.length > 6) {
            query.page = 1;
            query.perPage = 10;
            refresh();
          }
          break;
        case "desCpf":
          if (e.target.value.length > 6) {
            query.page = 1;
            query.perPage = 10;
            refresh();
          }
          break;
        default:
          break;
      } */
    }
  };

  const handleChangeStatus = (value: string) => {
    query.status = value;
    query.page = 1;
    query.perPage = 10;
    refresh();
  };

  const handleChangeColumn = (value: string) => {
    query.keywordColumn = value;
  };

  const handleChangeIsFixa = () => {
    setIsFixa(!isFixa);
    if (isFixa && query.isFixa) {
      delete query.isFixa;
    } else {
      query.isFixa = true;
    }

    query.page = 1;
    query.perPage = 10;
    refresh();
  };
  const handleChangeIsVar = () => {
    setIsVar(!isVar);
    if (isVar && query.isVar) {
      delete query.isVar;
    } else {
      query.isVar = true;
    }

    query.page = 1;
    query.perPage = 10;
    refresh();
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
                Status do cliente:
                <div className="flex">
                  <RadioGroup
                    defaultValue={query.status}
                    onValueChange={handleChangeStatus}
                  >
                    <div className="flex p-2 space-x-2">
                      <Label className="flex items-center space-x-2">
                        <RadioGroupItem value="ATIVO" />
                        <span>Ativo</span>
                      </Label>

                      <Label className="flex items-center space-x-2">
                        <RadioGroupItem value="INATIVO" />
                        <span>Inativo</span>
                      </Label>

                      <Label className="flex items-center space-x-2">
                        <RadioGroupItem value="null" />
                        <span>Todos</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </Label>
            </div>
            <div className="flex w-full">
              <Label className="w-full">
                Buscar cliente:
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
              <RadioGroup
                defaultValue={query.keywordColumn}
                onValueChange={handleChangeColumn}
              >
                <div className="grid grid-cols-3 gap-3 col-span-3">
                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="nomClien" />
                    <span>Nome</span>
                  </Label>

                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="email" />
                    <span>E-mail</span>
                  </Label>

                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" />
                    <span>Telefone</span>
                  </Label>

                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="desContr" />
                    <span>Contrato</span>
                  </Label>

                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="desCpf" />
                    <span>CPF/CNPJ</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <label className="text-base">Carteira:</label>
            </div>
            <div className="flex p-2 space-x-2">
              <Label className="flex items-center space-x-2">
                <Checkbox
                  checked={isFixa}
                  onCheckedChange={handleChangeIsFixa}
                />
                <span>Fixa</span>
              </Label>
              <Label className="flex items-center space-x-2">
                <Checkbox checked={isVar} onCheckedChange={handleChangeIsVar} />
                <span>Variável</span>
              </Label>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
