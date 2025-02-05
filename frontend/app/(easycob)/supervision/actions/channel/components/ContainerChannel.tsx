"use client";
import { useState } from "react";
import { IMeta } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import { fetchUserAndChannel, query } from "../../service/actions";
import Header from "@/app/(easycob)/components/Header";
import FilterPus from "../../components/FilterPus";
import { IUserChannel } from "../../interfaces/action";
import TableRecords from "./TableRecords";

export default function ContainerChannel({
  usersAndChannel,
}: {
  usersAndChannel: IUserChannel[];
}) {
  const [records, setRecords] = useState<IUserChannel[]>(usersAndChannel);
  const [pending, setPending] = useState<boolean>(false);

  const refresh = async () => {
    setPending(true);

    const r = await fetchUserAndChannel();
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
