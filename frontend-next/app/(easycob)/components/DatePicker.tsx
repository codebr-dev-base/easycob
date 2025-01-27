"use client";
import { useState, useEffect } from "react";
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

export function DatePicker({
  placeholder,
  onChange,
  defaultDate,
}: {
  placeholder: string;
  onChange: (range: DateRange) => void;
  defaultDate?: DateRange;
}) {
  // Ajusta a data atual para GMT-3 ao inicializar o estado
  const initializeDateWithGMT3 = (): Date => {
    const date = new Date();
    date.setHours(date.getHours() - 3); // Ajusta para GMT-3
    return date;
  };

  const [date, setDate] = useState<DateRange>({
    from: initializeDateWithGMT3(),
    to: initializeDateWithGMT3(),
  });

  useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate);
    }
  }, [defaultDate]);

  const handlerSelectRangeDate = (
    range: DateRange | undefined,
    selectedDay: Date,
    activeModifiers: ActiveModifiers,
    e: React.MouseEvent
  ) => {
    if (range) {
      setDate(range);

      if (range.from && range.to) {
        onChange(range);
      }
    }
  };

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
          mode="range"
          selected={date}
          onSelect={handlerSelectRangeDate}
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
