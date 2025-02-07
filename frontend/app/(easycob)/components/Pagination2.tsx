"use client";
import { IQueryParams } from "@/app/interfaces/fetch";
import { IMeta, IQueryPaginationParams } from "@/app/interfaces/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";

export default function Pagination({
  meta,
  query,
  refresh,
}: {
  meta: IMeta | undefined;
  query: IQueryPaginationParams;
  refresh: (newParams: Partial<IQueryParams>) => void;
}) {
  {
    const handlerNextPage = () => {
      if (meta?.currentPage) {
        refresh({page: meta.currentPage + 1});
      }
    };
    const handlerPreviousPage = () => {
      if (meta?.currentPage) {
        refresh({page: meta.currentPage - 1});
      }
    };
    const handlerFirstPage = () => {
      if (meta?.currentPage) {
        refresh({page: meta.firstPage});
      }
    };
    const handlerLastPage = () => {
      if (meta?.lastPage) {
        refresh({page: meta.lastPage});
      }
    };

    const handlerChangePerPage = (velue: string) => {
      refresh({perPage: Number(velue), page: 1});
    };

    return (
      meta && (
        <>
          <span className="px-2 text-sm">Mostrando</span>
          <Select
            onValueChange={handlerChangePerPage}
            defaultValue={`${query.perPage}`}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder="Mostrando" />
            </SelectTrigger>
            <SelectContent className="w-36">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="px-2 text-sm">de {meta?.total} resultados.</span>
          {meta?.currentPage && meta?.currentPage > 1 && (
            <>
              {" "}
              <Button variant={"outline"}>
                <MdKeyboardDoubleArrowLeft onClick={handlerFirstPage} />
              </Button>
              <Button onClick={handlerPreviousPage} variant={"outline"}>
                <MdKeyboardArrowLeft />
              </Button>
            </>
          )}

          <span className="px-2 py-2 text-sm border">
            Página {meta?.currentPage} de {meta?.lastPage}
          </span>
          {meta?.currentPage && meta?.currentPage < meta?.lastPage && (
            <>
              {" "}
              <Button onClick={handlerNextPage} variant={"outline"}>
                <MdKeyboardArrowRight />
              </Button>
              <Button onClick={handlerLastPage} variant={"outline"}>
                <MdKeyboardDoubleArrowRight />
              </Button>
            </>
          )}
        </>
      )
    );
  }
}
