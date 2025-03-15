import { formatDateToBR, isDateDisabled } from "@/app/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FaRegCalendar } from "react-icons/fa";

interface PopoverFormProps<T extends FieldValues> {
  children?: ReactNode;
  field: ControllerRenderProps<T>;
  limit?: number;
}

export default function PopoverForm<T extends FieldValues>({
  children,
  field,
  limit = 7,
}: PopoverFormProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const isInitialMount = useRef(true);
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (!isOpen) {
        field.onChange(field.value || "");
      }
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-min cursor-pointer"
      >
        {children ? (
          children
        ) : (
          <div className="w-full border rounded-lg justify-between items-center flex text-gray-700 py-2 px-3 mt-1 mb-1">
            {field.value
              ? formatDateToBR(field.value)
              : "dd/mm/aaaa"}
            <FaRegCalendar className="ml-auto h-4 w-4" />
          </div>
        )}
      </div>
      {isOpen && (
        <div className="absolute left-0 mt-0 min-w-min bg-white border rounded-lg shadow-lg p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(e) => {
              setDate(e);
              field.onChange(e?.toISOString().split("T")[0]);
            }}
            disabled={(date) => isDateDisabled(date, limit)}
            initialFocus
            locale={ptBR}
          />
        </div>
      )}
    </div>
  );
}
