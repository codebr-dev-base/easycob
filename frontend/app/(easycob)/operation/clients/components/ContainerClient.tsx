"use client";
import Header from "../../../components/Header";
import { useCallback, useEffect, useState } from "react";
import { fetchClients, query, setQuery } from "../service/clients";
import { IMeta, IPaginationResponse } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import { IClient } from "@/app/(easycob)/interfaces/clients";
import TableRecords from "./TableRecords";
import FilterPus from "./FilterPus";
import { useSearchParams } from "next/navigation";
import { buildQueryString, parseQueryString } from "@/app/lib/fetchAuth";
import { IQueryClienteParams } from "../interfaces/cliente";
import useClientsService from "../service/use-client-service";

export default function ContainerClient({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<IClient>;
  initialQuery: IQueryClienteParams;
}) {
  const {
    clients,
    isLoading,
    error,
    queryParams,
    fetchClients,
    setQueryParams
  } = useClientsService({ initialData, initialQuery });

  const refresh = useCallback(
    (newParams: Partial<IQueryClienteParams>) => {
      setQueryParams(newParams);
      fetchClients();
    },
    [setQueryParams, fetchClients]
  );

  if (!clients || !initialData) return null;

  return (
    <article className="max-w-full">
      <div className="p-2">
        <Header title="Clientes">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FilterPus
              query={queryParams.current as IQueryClienteParams}
              refresh={refresh}
            />
          </div>
        </Header>
      </div>

      <main className="p-2">
        <TableRecords
          meta={clients.meta}
          data={clients.data}
          refresh={refresh}
          query={queryParams.current as IQueryClienteParams}
          pending={isLoading}
        />
      </main>
    </article>
  );
}
