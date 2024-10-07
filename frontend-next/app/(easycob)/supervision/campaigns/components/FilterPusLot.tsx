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

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IUser } from "@/app/interfaces/auth";
import { IQueryLotParams } from "../interfaces/campaign";
import { ChangeEvent, useEffect, useState } from "react";
import { fetchUserByModule } from "@/app/(easycob)/admin/users/service/users";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function FilterPus({
  query,
  refresh,
}: {
  query: IQueryLotParams;
  refresh: () => void;
}) {
  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "keyword") {
      if (e.target.value.length > 4) {
        console.log(e.target.value);
        query.keywordColumn = "cliente";
        query.keyword = e.target.value;
        refresh();
      }
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
              <div className="flex w-full">
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
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
