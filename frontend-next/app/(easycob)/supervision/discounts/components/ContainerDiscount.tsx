"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "../../../components/Header";
import { useRef, useState } from "react";
import { IMeta } from "@/app/interfaces/pagination";
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
export default function ContainerDiscount({
  negotiations,
  promises,
  invoices,
}: {
  negotiations: {
    meta: IMeta;
    data: INegotiationOfPayment[];
  };
  promises: {
    meta: IMeta;
    data: IPromiseOfPayment[];
  };
  invoices: {
    meta: IMeta;
    data: INegotiationInvoice[];
  };
}) {
  const negotiationsMeta = useRef<IMeta>(negotiations.meta);
  const negotiationsData = useRef<INegotiationOfPayment[]>(negotiations.data);
  const promisesMeta = useRef<IMeta>(promises.meta);
  const promisesData = useRef<IPromiseOfPayment[]>(promises.data);
  const invoicesMeta = useRef<IMeta>(invoices.meta);
  const invoicesData = useRef<INegotiationInvoice[]>(invoices.data);

  const [pending, setPending] = useState<boolean>(false);
  const [type, setType] = useState<string>("negotiations");

  const refreshNegotiations = async () => {
    setPending(true);
    const n = await fetchNegotiations();
    negotiationsMeta.current = n.meta;
    negotiationsData.current = n.data;

    setPending(false);
  };

  const refreshPromises = async () => {
    setPending(true);
    const p = await fetchPromises();
    promisesMeta.current = p.meta;
    promisesData.current = p.data;

    setPending(false);
  };

  const refreshInvoices = async () => {
    setPending(true);
    const i = await fetchInvoices();
    invoicesMeta.current = i.meta;
    invoicesData.current = i.data;
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
              meta={negotiationsMeta.current}
              data={negotiationsData.current}
              refresh={refreshNegotiations}
              pending={pending}
            />
          </TabsContent>
          <TabsContent value="promises">
            <TabPromises
              query={queryPromises}
              meta={promisesMeta.current}
              data={promisesData.current}
              refresh={refreshPromises}
              pending={pending}
            />
          </TabsContent>
          <TabsContent value="invoices">
            <TabInvoices
              query={queryInvoices}
              meta={invoicesMeta.current}
              data={invoicesData.current}
              refresh={refreshInvoices}
              pending={pending}
            />
          </TabsContent>
        </Tabs>
      </main>
    </article>
  );
}
