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
import { checkUserModule } from "@/app/lib/auth";
import { ISubsidiary } from "@/app/(easycob)/supervision/actions/interfaces/action";
import { fetchSubsidiaries } from "@/app/(easycob)/supervision/actions/service/actions";
import { parseStringDateToDate } from "@/app/lib/utils";

export default function FilterPus({
  query,
  refresh,
}: {
  query: IQueryFollowingParams;
  refresh: (newParams: Partial<IQueryFollowingParams>) => void;
}) {
  const [status, setStatus] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [operators, setOperators] = useState<IUser[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<ISubsidiary[]>([]);

  useEffect(() => {
    fetchUserByModule("operator", true).then((value) => {
      setOperators(value ? value : []);
    });

    fetchSubsidiaries().then((result) => {
      if (result) {
        setSubsidiaries(result);
      }
    });
  }, []);

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

  const handleChangeDate = (range: DateRange | undefined) => {
    console.log("handleChangeDate", range);
    if (range && range.from && range.to) {
      refresh({
        startDate: range.from?.toISOString().split("T")[0],
        endDate: range.to?.toISOString().split("T")[0],
        page: 1,
      });
    } else {
      delete query.startDate;
      delete query.endDate;
      refresh({ ...query, page: 1 });
    }
  };

  const handleChangeDateCreate = (range: DateRange | undefined) => {
    console.log("handleChangeDateCreate", range);
    if (range && range.from && range.to) {
      refresh({
        startDateCreate: range.from?.toISOString().split("T")[0],
        endDateCreate: range.to?.toISOString().split("T")[0],
        page: 1,
      });
    } else {
      delete query.startDateCreate;
      delete query.endDateCreate;
      refresh({
        ...query,
        page: 1,
      });
    }
  };

  const handleChangeSubsidiary = (value: string) => {
    refresh({ nomLoja: value == "all" ? "" : value, page: 1 });
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
            {checkUserModule("admin") && (
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
            )}
            <div className="flex">
              <Label>
                Por data de vencimento:
                <DatePickerClear
                  placeholder="Período de vencimento"
                  onChange={handleChangeDate}
                  defaultDate={{
                    from: query.startDate
                      ? parseStringDateToDate(query.startDate)
                      : undefined,
                    to: query.endDate
                      ? parseStringDateToDate(query.endDate)
                      : undefined,
                  }}
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
            <div className="flex">
              <Label className="w-full">
                Unidade:
                <Select
                  onValueChange={handleChangeSubsidiary}
                  defaultValue={query.nomLoja}
                >
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
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
