"use client";
import Header from "@/app/(easycob)/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ta } from "date-fns/locale";
import { useCallback, useState } from "react";
import { IQueryTagClientParams, ITag } from "../interfaces/tag";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { IClient } from "@/app/(easycob)/interfaces/clients";
import TableRecords from "./TableRecords";
import useClientsService from "../service/use-client-service";
import FilterPus from "./FilterPus";

export default function ContainerTag({
  tags,
  initialData,
  initialQuery,
}: {
  tags: ITag[];
  initialData: IPaginationResponse<IClient>;
  initialQuery: IQueryTagClientParams;
}) {
  const [selectTag, setSelectTag] = useState<number>(tags[0].id);

  const {
    clients,
    isLoading,
    error,
    queryParams,
    fetchClients,
    setQueryParams,
  } = useClientsService({
    initialData,
    initialQuery,
  });

  const refresh = useCallback(
    (newParams: Partial<IQueryTagClientParams>) => {
      setQueryParams(newParams);
      fetchClients();
    },
    [setQueryParams, fetchClients]
  );

  if (!clients || !initialData) return null;
  const handleTabChange = (value: string) => {
    setSelectTag(Number(value));
    refresh({ tagId: value });
  };

  return (
    <article>
      <div className="p-2">
        <Header title="Tags">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FilterPus
              query={queryParams.current as IQueryTagClientParams}
              refresh={refresh}
            />
          </div>
        </Header>
      </div>
      <main className="p-2">
        <Tabs
          defaultValue={`${selectTag}`}
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="flex justify-center bg-white rounded-lg border">
            {tags.map((tag) => (
              <TabsTrigger
                key={tag.id}
                value={`${tag.id}`}
                className="rounded-full mx-1 data-[state=active]:text-white hover:text-white"
                style={{
                  backgroundColor: tag.color,
                }}
              >
                {tag.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {tags.map((tag) => (
            <TabsContent key={tag.id} value={`${tag.id}`}>
              <TableRecords
                clients={clients}
                query={queryParams.current as IQueryTagClientParams}
                pending={isLoading}
                refresh={refresh}
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </article>
  );
}
