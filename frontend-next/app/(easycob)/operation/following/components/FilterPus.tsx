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
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { ChangeEvent, useEffect, useState } from "react";
import { fetchUserByModule } from "@/app/(easycob)/admin/users/service/users";
import { IQueryDiscountParams } from "../interfaces/discounts";
import { IReturnType } from "../../actions/interfaces/action";
import { DatePicker } from "@/app/(easycob)/components/DatePicker";
import { DateRange } from "react-day-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { DatePickerClear } from "@/app/(easycob)/components/DatePickerClear";

export default function FilterPus({
  query,
  refresh,
}: {
  query: IQueryDiscountParams;
  refresh: () => void;
}) {
  const [statusOperator, setStatusOperator] = useState(true);
  const [status, setStatus] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [operators, setOperators] = useState<IUser[]>([]);

  useEffect(() => {
    fetchUserByModule("operator", true).then((value) => {
      setOperators(value ? value : []);
    });

    const opts: Option[] = [];
  }, []);

  const handleChangeStatus = () => {
    query.status = !status;
    setStatus(!status);
    query.page = 1;
    query.perPage = 10;
    refresh();
  };

  const handleChangeDiscount = () => {
    query.discount = !discount;
    setDiscount(!discount);
    query.page = 1;
    query.perPage = 10;
    refresh();
  };

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
    refreshOperators(statusOperator);
  }, [statusOperator]);

  const refreshOperators = async (value: boolean) => {
    const result = await fetchUserByModule("operator", value);
    setOperators(result ? result : []);
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

  const handleChangeDateCreate = (range: DateRange) => {
    if (range.from && range.to) {
      query.startDateCreate = range.from?.toISOString().split("T")[0];
      query.endDateCreate = range.to?.toISOString().split("T")[0];
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
          <CardHeader>
            <CardTitle>Filtro</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <div className="flex w-full">
              <Label className="w-full">
                Por nome da cliente:
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
              <Label className="w-full">
                Por operdor:
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
            <div className="flex">
              <Label>
                Por data de vencimento:
                <DatePicker
                  placeholder="Período de vencimento"
                  onChange={handleChangeDate}
                />
              </Label>
            </div>
            <div className="flex">
              <Label className="w-full">
                Por data de criação:
                <DatePickerClear
                  placeholder="Período da criação"
                  onChange={handleChangeDateCreate}
                />
              </Label>
            </div>

            <div className="flex">
              <Label className="flex items-center space-x-1 m-0">
                <Checkbox
                  checked={status}
                  onCheckedChange={handleChangeStatus}
                />
                <span>Status Registro</span>
              </Label>
            </div>
            <div className="flex">
              <Label className="flex items-center space-x-1 py-2">
                <Checkbox
                  checked={discount}
                  onCheckedChange={handleChangeDiscount}
                />
                <span>Acordo com descontos</span>
              </Label>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
