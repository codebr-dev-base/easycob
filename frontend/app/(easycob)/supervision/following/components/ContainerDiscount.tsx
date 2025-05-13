"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "../../../components/Header";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { IMeta, IPaginationResponse } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import TabNegotiations from "./TabNegotiations";
import TabPromises from "./TabPromises";
import TabInvoices from "./TabInvoices";
import FilterPus from "./FilterPus";
import { IQueryDiscountParams } from "../interfaces/discounts";
import useDiscountService from "../service/use-discount-service";

export default function ContainerFlowings({
  initialQuery,
}: {
  initialQuery: IQueryDiscountParams;
}) {
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
  } = useDiscountService({
    initialQuery: initialQuery,
  });

  const [pending, setPending] = useState<boolean>(false);

  const [type, setType] = useState<string>("negotiations");

  const handleTabChange = (value: string) => {
    setType(value);

    switch (value) {
      case "negotiations":
        fetchNegotiations();
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
    (newParams: Partial<IQueryDiscountParams>) => {
      setQueryParams(newParams);
      switch (type) {
        case "negotiations":
          fetchNegotiations();
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
              query={queryParams.current as IQueryDiscountParams}
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
            <TabsTrigger value="promises" className="TabsTrigger">
              Acordos a vista
            </TabsTrigger>
            <TabsTrigger value="invoices" className="TabsTrigger">
              Parcelas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="negotiations">
            <TabNegotiations
              negotiations={negotiations}
              query={queryParams.current as IQueryDiscountParams}
              refresh={refresh}
              pending={isLoading}
            />
          </TabsContent>
          <TabsContent value="promises">
            <TabPromises
              promises={promises}
              query={queryParams.current as IQueryDiscountParams}
              refresh={refresh}
              pending={pending}
            />
          </TabsContent>
          <TabsContent value="invoices">
            <TabInvoices
              invoices={invoices}
              query={queryParams.current as IQueryDiscountParams}
              refresh={refresh}
              pending={pending}
            />
          </TabsContent>
        </Tabs>
      </main>
    </article>
  );
}
