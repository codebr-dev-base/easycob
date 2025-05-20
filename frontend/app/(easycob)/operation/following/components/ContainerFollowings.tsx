"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "../../../components/Header";
import { useCallback, useEffect, useRef, useState } from "react";
import { IMeta, IPaginationResponse } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import {
  IAction,
  INegotiationInvoice,
  INegotiationOfPayment,
  IPromiseOfPayment,
} from "@/app/(easycob)/interfaces/actions";
import TabNegotiations from "./TabNegotiations";
import TabPromises from "./TabPromises";
import TabInvoices from "./TabInvoices";
import FilterPus from "./FilterPus";
import useFollowingService from "../service/use-following-service";
import { IQueryFollowingParams } from "../interfaces/following";
import useActionsService from "@/app/(easycob)/supervision/actions/service/use-action-service";
import { IQueryActionParams } from "@/app/(easycob)/supervision/actions/interfaces/action";

export default function ContainerFollowings() {

  const initialQuery: IQueryFollowingParams = {
    page: 1,
    perPage: 10,
    orderBy: "id",
    descending: false,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  };
  
  const {
    negotiations,
    agreements,
    invoices,
    promises,
    isLoading,
    error,
    queryParams,
    setQueryParams,
    fetchNegotiations,
    fetchAgreements,
    fetchInvoices,
    fetchPromises,
  } = useFollowingService({
    initialQuery: initialQuery,
  });

  const [type, setType] = useState<string>("negotiations");

  const handleTabChange = (value: string) => {
    setType(value);

    switch (value) {
      case "negotiations":
        fetchNegotiations();
        break;
      case "agreements":
        setQueryParams({ typeActionIds: 1 });
        fetchAgreements();
        break;
      case "promises":
        setQueryParams({ typeActionIds: 2 });
        fetchPromises();
        break;
      default:
        fetchInvoices();
        break;
    }
  };

  const refresh = useCallback(
    (newParams: Partial<IQueryFollowingParams>) => {
      setQueryParams(newParams);
      switch (type) {
        case "negotiations":
          fetchNegotiations();
          break;
        case "agreements":
          setQueryParams({ typeActionIds: 1 });
          fetchAgreements();
          break;
        case "promises":
          setQueryParams({ typeActionIds: 2 });
          fetchPromises();
          break;
        default:
          fetchInvoices();
          break;
      }
    },
    [setQueryParams, fetchNegotiations, fetchPromises, fetchInvoices]
  );

  useEffect(() => {
    fetchNegotiations();
  }, []);

  return (
    <article>
      <div className="p-2">
        <Header title="Descontos">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FilterPus
              query={queryParams.current as IQueryFollowingParams}
              refresh={refresh}
            />
          </div>
        </Header>
      </div>

      <main className="p-2">
        <Tabs
          defaultValue="negotiations"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="flex justify-center bg-white rounded-lg border">
            <TabsTrigger value="negotiations" className="TabsTrigger">
              Entrada
            </TabsTrigger>
            <TabsTrigger value="agreements" className="TabsTrigger">
              Acordos a vista
            </TabsTrigger>
            <TabsTrigger value="invoices" className="TabsTrigger">
              Parcelas
            </TabsTrigger>
            <TabsTrigger value="promises" className="TabsTrigger">
              Promessas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="negotiations">
            <TabNegotiations
              negotiations={negotiations}
              query={queryParams.current as IQueryFollowingParams}
              refresh={refresh}
              pending={isLoading}
            />
          </TabsContent>
          <TabsContent value="agreements">
            <TabPromises
              promises={agreements}
              query={queryParams.current as IQueryFollowingParams}
              refresh={refresh}
              pending={isLoading}
            />
          </TabsContent>
          <TabsContent value="invoices">
            <TabInvoices
              invoices={invoices}
              query={queryParams.current as IQueryFollowingParams}
              refresh={refresh}
              pending={isLoading}
            />
          </TabsContent>
          <TabsContent value="promises">
            <TabPromises
              promises={promises}
              query={queryParams.current as IQueryFollowingParams}
              refresh={refresh}
              pending={isLoading}
            />
          </TabsContent>
        </Tabs>
      </main>
    </article>
  );
}
