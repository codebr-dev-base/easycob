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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { IQueryUserParams } from "../interfaces/user";

export default function FilterPlus({
  query,
  refresh,
}: {
  query: IQueryUserParams;
  refresh: () => void;
}) {
  const [isActive, setIsActive] = useState<boolean | null>(true);

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "keyword") {
      query.keyword = e.target.value;
      query.page = 1;
      query.perPage = 10;
      refresh();
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

  return (
    <Popover>
      <PopoverTrigger className={buttonVariants({ variant: "secondary" })}>
        <TbFilterPlus />
      </PopoverTrigger>
      <PopoverContent align={"end"} className="w-96">
        <Card>
          <div className="flex text-2xl px-2">
            <h3>Filtros</h3>
          </div>

          <CardContent className="p-2 space-y-2">
            <div className="flex w-full">
              <Label className="w-full">
                Status do usuário:
                <div className="flex">
                  <RadioGroup
                    defaultValue={`${query.status}`}
                    onValueChange={handleChangeStatus}
                  >
                    <div className="flex p-2 space-x-2">
                      <Label className="flex items-center space-x-2">
                        <RadioGroupItem value="true" />
                        <span>Ativo</span>
                      </Label>

                      <Label className="flex items-center space-x-2">
                        <RadioGroupItem value="false" />
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
                Buscar usuário:
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
                    <RadioGroupItem value="name" />
                    <span>Nome</span>
                  </Label>

                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="email" />
                    <span>E-mail</span>
                  </Label>

                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="cpf" />
                    <span>CPF</span>
                  </Label>

                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" />
                    <span>Telefone</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
