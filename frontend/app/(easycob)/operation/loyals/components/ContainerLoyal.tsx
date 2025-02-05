"use client";
import React, { useEffect, useState } from "react";
import { ILoyal } from "../interfaces/loyal";
import { IMeta } from "../../../../interfaces/pagination";
import TableRecords from "./TableRecords";
import { buildQueryString, parseQueryString } from "@/app/lib/fetchAuth";
import { useSearchParams } from "next/navigation";
import { fetchLoyals, query, setQuery } from "../service/loyals";
import Header from "@/app/(easycob)/components/Header";
import FilterPus from "./FilterPus";

export default function ContainerLoyal({
  loyals,
}: {
  loyals: {
    meta: IMeta;
    data: ILoyal[];
  };
}) {
  const [meta, setMeta] = useState<IMeta>(loyals.meta);
  const [data, setData] = useState<ILoyal[]>(loyals.data ? loyals.data : []);
  const [pending, setPending] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.toString()) {
      const historyQuery = parseQueryString(searchParams);
      setQuery(historyQuery);
      setPending(true);
      fetchLoyals().then((records) => {
        setMeta(records.meta);
        setData(records.data);
        setPending(false);
      });
    } else {
      const queryString = buildQueryString(query);
      window.history.pushState(null, "", `?${queryString}`);
    }
  }, []);

  const refresh = async () => {
    const queryString = buildQueryString(query);
    window.history.pushState(null, "", `?${queryString}`);
    setPending(true);
    fetchLoyals().then((records) => {
      setMeta(records.meta);
      setData(records.data);
      setPending(false);
    });
  };

  return (
    <article className="max-w-full">
      <div className="p-2">
        <Header title="Fidelizados">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FilterPus query={query} refresh={refresh} /> 
          </div>
        </Header>
      </div>

      <main className="p-2">
        <TableRecords
          meta={meta}
          data={data}
          refresh={refresh}
          query={query}
          pending={pending}
        />
      </main>
    </article>
  );
}
