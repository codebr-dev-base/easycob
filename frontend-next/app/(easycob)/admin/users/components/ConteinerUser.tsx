"use client";
import { ISkillModule, IUser } from "@/app/interfaces/auth";
import { IMeta } from "@/app/interfaces/pagination";
import { buildQueryString, parseQueryString } from "@/app/lib/fetchAuth";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchUsers, query, setQuery } from "../service/users";
import TableRecords from "./TableRecords";
import Header from "@/app/(easycob)/components/Header";
import FilterPlus from "./FilterPlus";
import { FormUser } from "./FormUser";
import { Button } from "@/components/ui/button";
import { FaUserPlus } from "react-icons/fa";

export default function ConteinerUser({
  users,
  modules
}: {
  users: {
    meta: IMeta;
    data: IUser[];
  };
  modules: ISkillModule[]
}) {
  const [meta, setMeta] = useState<IMeta>(users.meta);
  const [data, setData] = useState<IUser[]>(users.data ? users.data : []);
  const [pending, setPending] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.toString()) {
      const historyQuery = parseQueryString(searchParams);
      setQuery(historyQuery);
      setPending(true);
      fetchUsers().then((records) => {
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
    fetchUsers().then((records) => {
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
            <FormUser refresh={refresh} user={null} modules={modules}>
              <Button className="mx-1" variant={"secondary"}>
                <FaUserPlus />
              </Button>
            </FormUser>
            <FilterPlus query={query} refresh={refresh} />
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
          modules={modules}
        />
      </main>
    </article>
  );
}
