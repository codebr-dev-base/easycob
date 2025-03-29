"use client";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";
import { formatDateToBR } from "@/app/lib/utils";
import { ActiveModifiers, DateRange } from "react-day-picker";
import { on } from "events";
import { check } from "../operation/loyals/service/loyals";

export function DatePicker({
  placeholder,
  onChange,
  defaultDate,
}: {
  placeholder: string;
  onChange: (range: DateRange) => void;
  defaultDate?: DateRange | undefined;
}) {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const prevDate = useRef<DateRange>({ from: undefined, to: undefined });

  useEffect(() => {
    if (defaultDate) {
      prevDate.current = { from: defaultDate.from, to: defaultDate.to };
      setDate(defaultDate);
    }
  }, []);

  useEffect(() => {
    if (date && date.from && date.to) {
      if (
        prevDate.current.from !== date.from ||
        prevDate.current.to !== date.to
      ) {
        prevDate.current = { from: date.from, to: date.to };
        onChange(date);
      }
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from && date?.to ? (
            `${formatDateToBR(date?.from.toISOString())} 
            -  
            ${formatDateToBR(date?.to.toISOString())}`
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          initialFocus
          mode="range"
          selected={date}
          onSelect={setDate}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
