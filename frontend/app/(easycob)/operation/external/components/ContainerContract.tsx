"use client";

import { IPaginationResponse } from "@/app/interfaces/pagination";
import { IContract, IQueryContractParams } from "../interfaces/contracts";
import useContractService from "../service/use-contract-service";
import { useCallback } from "react";
import Header from "@/app/(easycob)/components/Header";
import FilterPus from "./FilterPus";
import TableRecords from "./TableRecords";

interface PropsContainerContract {
  initialData: IPaginationResponse<IContract>;
  initialQuery: IQueryContractParams;
}
export default function ContainerContract({
  initialData,
  initialQuery,
}: PropsContainerContract) {
  const {
    contracts,
    isLoading,
    error,
    queryParams,
    fetchContracts,
    setQueryParams,
  } = useContractService({ initialData, initialQuery });

  const refresh = useCallback(
    (newParams: Partial<IQueryContractParams>) => {
      setQueryParams(newParams);
      fetchContracts();
    },
    [setQueryParams, fetchContracts]
  );

  if (!contracts || !initialData) return null;

  return (
    <article className="max-w-full">
      <div className="p-2">
        <Header title="Contratos">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FilterPus
              query={queryParams.current as IQueryContractParams}
              refresh={refresh}
            />
          </div>
        </Header>
      </div>

      <main className="p-2">
        <TableRecords
          contracts={contracts}
          refresh={refresh}
          query={queryParams.current as IQueryContractParams}
          pending={isLoading}
        />
      </main>
    </article>
  );
}
