import { RxCaretSort, RxArrowDown, RxArrowUp } from "react-icons/rx";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IQueryPaginationParams } from "@/app/interfaces/pagination";
import { useEffect, useState } from "react";

export function HeaderTable({
  columnName,
  fieldName,
  query,
  refresh,
}: {
  columnName: string;
  fieldName: string;
  query: IQueryPaginationParams;
  refresh: () => {};
}) {
  const [descending, setDescending] = useState<boolean>(
    query.descending ? query.descending : false
  );
  const [orderBy, setOrderBy] = useState(query.orderBy ? query.orderBy : "id");

  useEffect(() => {
    setOrderBy(query.orderBy);
  }, [query.orderBy]);

  const toggleSorting = () => {
    setDescending(!descending);
    setOrderBy(fieldName);
    query.orderBy = fieldName;
    query.descending = !descending;
    refresh();
  };

  return (
    <div className={cn("flex items-center")}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 p-0"
        onClick={toggleSorting}
      >
        <span>{columnName}</span>
        {orderBy != fieldName ? (
          <RxCaretSort className="ml-2 h-4 w-4" />
        ) : descending == false ? (
          <RxArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <RxArrowUp className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
