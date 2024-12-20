"use client";
import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import { fetchClients, query, setQuery } from "../service/clients";
import { IMeta } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import { IClient } from "@/app/(easycob)/interfaces/clients";
import TableRecords from "./TableRecords";
import FilterPus from "./FilterPus";
import { useSearchParams } from "next/navigation";
import { buildQueryString, parseQueryString } from "@/app/lib/fetchAuth";

export default function ContainerClient({
  clients,
}: {
  clients: {
    meta: IMeta;
    data: IClient[];
  };
}) {
  const [meta, setMeta] = useState<IMeta>(clients.meta);
  const [data, setData] = useState<IClient[]>(clients.data ? clients.data : []);
  const [pending, setPending] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.toString()) {
      const historyQuery = parseQueryString(searchParams);
      setQuery(historyQuery);
      setPending(true);
      fetchClients().then((records) => {
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
    fetchClients().then((records) => {
      setMeta(records.meta);
      setData(records.data);
      setPending(false);
    });
  };

  return (
    <article className="max-w-full">
      <div className="p-2">
        <Header title="Clientes">
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
