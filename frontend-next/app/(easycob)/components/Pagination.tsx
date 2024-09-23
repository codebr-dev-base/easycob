"use client";
import { IMeta, IQueryPaginationParams } from "@/app/interfaces/pagination";
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
  refresh: () => void;
}) {
  {
    const handlerNextPage = () => {
      if (meta?.currentPage) {
        query.page = meta.currentPage + 1;
        refresh();
      }
    };
    const handlerPreviousPage = () => {
      if (meta?.currentPage) {
        query.page = meta.currentPage - 1;
        refresh();
      }
    };
    const handlerFirstPage = () => {
      if (meta?.currentPage) {
        query.page = meta.firstPage;
        refresh();
      }
    };
    const handlerLastPage = () => {
      if (meta?.lastPage) {
        query.page = meta.lastPage;
        refresh();
      }
    };

    const handlerChangePerPage = (velue: string) => {
      query.perPage = Number(velue);
      query.page = 1;
      refresh();
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
              <button>
                <MdKeyboardDoubleArrowLeft onClick={handlerFirstPage} />
              </button>
              <button onClick={handlerPreviousPage}>
                <MdKeyboardArrowLeft />
              </button>
            </>
          )}

          <span className="px-2 text-sm">
            Página {meta?.currentPage} de {meta?.lastPage}
          </span>
          {meta?.currentPage && meta?.currentPage < meta?.lastPage && (
            <>
              {" "}
              <button onClick={handlerNextPage}>
                <MdKeyboardArrowRight />
              </button>
              <button onClick={handlerLastPage}>
                <MdKeyboardDoubleArrowRight />
              </button>
            </>
          )}
        </>
      )
    );
  }
}
