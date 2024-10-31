/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";

import { TbFilterPlus } from "react-icons/tb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IUser } from "@/app/interfaces/auth";
import { IQueryCampaignParams } from "../interfaces/campaign";
import { ChangeEvent, useEffect, useState } from "react";
import { fetchUserByModule } from "@/app/(easycob)/admin/users/service/users";
import { DateRange } from "react-day-picker";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/app/(easycob)/components/DatePicker";

export default function FilterPus({
  query,
  refresh,
  operators: op,
}: {
  query: IQueryCampaignParams;
  refresh: () => void;
  operators: IUser[];
}) {
  const [operators, setOperators] = useState<IUser[]>(op);

  const [status, setStatus] = useState(true);
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

  useEffect(() => {
    refreshOperators(status);
  }, [status]);

  const refreshOperators = async (value: boolean) => {
    let ops: IUser[] = [];
    const supervisors = await fetchUserByModule("supervisor", value);
    const admins = await fetchUserByModule("admin", value);
    if (Array.isArray(supervisors) && Array.isArray(admins)) {
      ops = [...admins];
    }
    setOperators(ops);
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
                Por nome da campanha:
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
                Por usuário:
                <Select onValueChange={handleChangeOperator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Usuário" />
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
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
