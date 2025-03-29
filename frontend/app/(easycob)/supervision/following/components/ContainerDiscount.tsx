"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "../../../components/Header";
import { use, useEffect, useRef, useState } from "react";
import { IMeta, IPaginationResponse } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import {
  INegotiationInvoice,
  INegotiationOfPayment,
  IPromiseOfPayment,
} from "@/app/(easycob)/interfaces/actions";
import TabNegotiations from "./TabNegotiations";
import TabPromises from "./TabPromises";
import TabInvoices from "./TabInvoices";
import FilterPus from "./FilterPus";
import { fetchInvoices, queryInvoices } from "../service/invoices";
import { fetchPromises, queryPromises } from "../service/promises";
import { fetchNegotiations, queryNegotiations } from "../service/negotiations";
export default function ContainerFlowings() {
  const negotiations = useRef<IPaginationResponse<INegotiationOfPayment> | null>(null);
  const promises = useRef<IPaginationResponse<IPromiseOfPayment> | null>(null);
  const invoices = useRef<IPaginationResponse<INegotiationInvoice> | null>(null);

  const [pending, setPending] = useState<boolean>(false);
  const [type, setType] = useState<string>("negotiations");

  const refreshNegotiations = async () => {
    setPending(true);
    const n = await fetchNegotiations();
    negotiations.current = n;
    setPending(false);
  };

  const refreshPromises = async () => {
    setPending(true);
    const p = await fetchPromises();
    promises.current = p;
    setPending(false);
  };

  const refreshInvoices = async () => {
    setPending(true);
    const i = await fetchInvoices();
    invoices.current = i;
    setPending(false);
  };

  const handleTabChange = (value: string) => {
    setType(value);

    switch (value) {
      case "negotiations":
        refreshNegotiations();
        break;
      case "promises":
        refreshPromises();
        break;
      default:
        refreshInvoices();
        break;
    }
  };

  useEffect(() => {
    refreshNegotiations();
    //refreshPromises();
    //refreshInvoices();
  }, []);

  return (
    <article>
      <div className="p-2">
        <Header title="Descontos">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            {type === "negotiations" && (
              <FilterPus query={queryNegotiations} refresh={refreshNegotiations} />
            )}
            {type === "promises" && (
              <FilterPus query={queryPromises} refresh={refreshPromises} />
            )}
            {type === "invoices" && (
              <FilterPus query={queryInvoices} refresh={refreshInvoices} />
            )}
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
              query={queryNegotiations}
              negotiations={negotiations.current}
              refresh={refreshNegotiations}
              pending={pending}
            />
          </TabsContent>
          <TabsContent value="promises">
            <TabPromises
              query={queryPromises}
              promises={promises.current}
              refresh={refreshPromises}
              pending={pending}
            />
          </TabsContent>
          <TabsContent value="invoices">
            <TabInvoices
              query={queryInvoices}
              invoices={invoices.current}
              refresh={refreshInvoices}
              pending={pending}
            />
          </TabsContent>
        </Tabs>
      </main>
    </article>
  );
}
