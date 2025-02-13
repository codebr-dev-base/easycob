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
import { Option } from "@/components/ui/multiple-selector";
import { ChangeEvent, use, useEffect, useState } from "react";
import { fetchUserByModule } from "@/app/(easycob)/admin/users/service/users";
import { IQueryFollowingParams } from "../interfaces/following";
import { DatePicker } from "@/app/(easycob)/components/DatePicker";
import { DateRange } from "react-day-picker";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { DatePickerClear } from "@/app/(easycob)/components/DatePickerClear";

export default function FilterPus({
  query,
  refresh,
}: {
  query: IQueryFollowingParams;
  refresh: (newParams: Partial<IQueryFollowingParams>) => void;
}) {
  const [status, setStatus] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [rangeDateCreate, setRangeDateCreate] = useState<DateRange | undefined>(
    undefined
  );
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: new Date(new Date().setHours(1, 1, 1, 0)),
    to: new Date(new Date().setHours(23, 59, 59, 999)),
  });
  const [operators, setOperators] = useState<IUser[]>([]);

  useEffect(() => {
    fetchUserByModule("operator", true).then((value) => {
      setOperators(value ? value : []);
    });

    const opts: Option[] = [];
  }, []);

  useEffect(() => {
    if (query.status && query.status == "true") {
      setStatus(true);
    } else if (query.status && query.status == "false") {
      setStatus(false);
    }

    if (query.discount && query.discount == "true") {
      setDiscount(true);
    } else if (query.discount && query.discount == "false") {
      setDiscount(false);
    }
  }, [query.status, query.discount]);

  useEffect(() => {
    if (query.startDate && query.endDate) {
      setRangeDate({
        from: new Date(query.startDate),
        to: new Date(query.endDate),
      });
    }
  }, [query.startDate, query.endDate]);

  useEffect(() => {
    if (query.startDateCreate && query.endDateCreate) {
      setRangeDateCreate({
        from: new Date(query.startDateCreate),
        to: new Date(query.endDateCreate),
      });
    }
  }, [query.startDateCreate, query.endDateCreate]);

  const handleChangeStatus = () => {
    setStatus(!status);
    refresh({ status: `${!status}`, page: 1 });
  };

  const handleChangeDiscount = () => {
    setDiscount(!discount);
    refresh({ discount: `${!discount}`, page: 1 });
  };

  const handleChangeOperator = (value: string) => {
    refresh({ userId: value == "all" ? "" : value, page: 1 });
  };

  useEffect(() => {
    refreshOperators(status);
  }, [status]);

  const refreshOperators = async (value: boolean) => {
    const result = await fetchUserByModule("operator", value);
    setOperators(result ? result : []);
  };

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "keyword") {
      refresh({ keyword: e.target.value, page: 1 });
    }
  };

  const handleChangeDate = (range: DateRange) => {
    if (range.from && range.to) {
      refresh({
        startDate: range.from?.toISOString().split("T")[0],
        endDate: range.to?.toISOString().split("T")[0],
        page: 1,
      });
    }
  };

  const handleChangeDateCreate = (range: DateRange) => {
    if (range.from && range.to) {
      refresh({
        startDateCreate: range.from?.toISOString().split("T")[0],
        endDateCreate: range.to?.toISOString().split("T")[0],
        page: 1,
      });
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
            <CardDescription></CardDescription>
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
                    defaultValue={query.keyword ? query.keyword : ""}
                  />
                </div>
              </Label>
            </div>
            <div className="flex">
              <Label className="w-full">
                Por operador:
                <Select
                  onValueChange={handleChangeOperator}
                  defaultValue={query.userId}
                >
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
                  defaultDate={rangeDate}
                />
              </Label>
            </div>
            <div className="flex">
              <Label className="w-full">
                Por data de criação:
                <DatePicker
                  placeholder="Período da criação"
                  onChange={handleChangeDateCreate}
                  defaultDate={rangeDateCreate}
                />
              </Label>
            </div>

            <div className="flex">
              <Label className="flex items-center space-x-1 m-0">
                {status}
                <Checkbox
                  defaultChecked={status}
                  onCheckedChange={handleChangeStatus}
                />
                <span>Status Registro</span>
              </Label>
            </div>
            <div className="flex">
              <Label className="flex items-center space-x-1 py-2">
                <Checkbox
                  defaultChecked={discount}
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
