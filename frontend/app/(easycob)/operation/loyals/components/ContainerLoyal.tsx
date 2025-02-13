"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ILoyal, IQueryLoyalParams } from "../interfaces/loyal";
import { IPaginationResponse } from "../../../../interfaces/pagination";
import TableRecords from "./TableRecords";
import Header from "@/app/(easycob)/components/Header";
import FilterPus from "./FilterPus";
import useLoyalsService from "../service/use-loyals-service";

export default function ContainerLoyal({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<ILoyal>;
  initialQuery: IQueryLoyalParams;
}) {
  const {
    loyals,
    setLoyals,
    isLoading,
    error,
    queryParams,
    fetchLoyals,
    setQueryParams,
  } = useLoyalsService({ initialData, initialQuery });

  const refresh = useCallback(
    (newParams: Partial<IQueryLoyalParams>) => {
      setQueryParams(newParams);
      fetchLoyals();
    },
    [setQueryParams, fetchLoyals]
  );

  if (!loyals || !initialData){
    return (
      <div className="w-full h-full">
        <span>Api indisponivel</span>
      </div>
    );
  }

  return (
    <article className="max-w-full">
      <div className="p-2">
        <Header title="Fidelizados">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FilterPus
              query={queryParams.current as IQueryLoyalParams}
              refresh={refresh}
            />
          </div>
        </Header>
      </div>

      <main className="p-2">
        <TableRecords
          loyals={loyals}
          query={queryParams.current as IQueryLoyalParams}
          refresh={refresh}
          pending={isLoading}
          setLoyals={setLoyals}
        />
      </main>
    </article>
  );
}
