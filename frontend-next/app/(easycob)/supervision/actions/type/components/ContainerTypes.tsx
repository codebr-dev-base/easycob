"use client";
import { useState } from "react";
import { IMeta } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import { fetchUserAndTypes, query } from "../../service/actions";
import Header from "@/app/(easycob)/components/Header";
import FilterPus from "../../components/FilterPus";
import { IUserAndTypesData } from "../../interfaces/action";
import TableRecords from "./TableRecords";

export default function ContainerTypes({
  usersAndTypes,
}: {
  usersAndTypes: IUserAndTypesData[];
}) {
  const [records, setRecords] = useState<IUserAndTypesData[]>(usersAndTypes);
  const [pending, setPending] = useState<boolean>(false);

  const refresh = async () => {
    setPending(true);

    const r = await fetchUserAndTypes();
    setRecords(r);
    setPending(false);
  };

  return (
    <article className="max-w-full">
      <div className="p-2">
        <Header title="Acionamentos">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FilterPus query={query} refresh={refresh} />
          </div>
        </Header>
      </div>

      <main className="p-2">
        <TableRecords userData={records} />
      </main>
    </article>
  );
}
