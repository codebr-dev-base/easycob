"use client";
import Header from "../../../components/Header";
import { useState } from "react";
import {
  fetchActions,
  fetchChartType,
  fetchChartUser,
  fetchChartUserAndType,
  query,
} from "../service/actions";
import { IMeta } from "@/app/interfaces/pagination";
import "@/app/assets/css/tabs.css";
import FilterPus from "./FilterPus";
import { IAction } from "@/app/(easycob)/interfaces/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabRecords from "./TabRecords";
import TabChart from "./TabChart";
import { IChartConfig, IChartData, IChartDataStack } from "../interfaces/action";

export default function ContainerAction({
  actions,
  chartType: ct,
  chartUser: cu,
  chartUserType: cut,
}: {
  actions: {
    meta: IMeta;
    data: IAction[];
  };
  chartType: {
    chartData: IChartData[];
    chartConfig: IChartConfig;
  };
  chartUser: {
    chartData: IChartData[];
    chartConfig: IChartConfig;
  };
  chartUserType: {
    chartData: IChartDataStack[];
    chartConfig: IChartConfig;
  };
}) {
  const [meta, setMeta] = useState<IMeta>(actions.meta);
  const [data, setData] = useState<IAction[]>(actions.data ? actions.data : []);
  const [pending, setPending] = useState<boolean>(false);

  const [chartType, setChartType] = useState<{
    chartData: IChartData[];
    chartConfig: IChartConfig;
  }>(ct);

  const [chartUser, setChartUser] = useState<{
    chartData: IChartData[];
    chartConfig: IChartConfig;
  }>(cu);

  const [chartUserType, setChartUserType] = useState<{
    chartData: IChartDataStack[];
    chartConfig: IChartConfig;
  }>(cut);

  const refresh = async () => {
    setPending(true);

    const [records, ct, cu, cut] = await Promise.all([
      fetchActions(),
      fetchChartType(),
      fetchChartUser(),
      fetchChartUserAndType()
    ]);

    setChartType(ct);
    setChartUser(cu);
    setChartUserType(cut);

    setMeta(records.meta);
    setData(records.data);
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
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="flex justify-center bg-white rounded-lg border">
            <TabsTrigger value="chart" className="TabsTrigger">
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="records" className="TabsTrigger">
              Acionamentos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <TabChart chartType={chartType} chartUser={chartUser} chartUserType={chartUserType} query={query}/>
          </TabsContent>
          <TabsContent value="records">
            <TabRecords
              meta={meta}
              data={data}
              refresh={refresh}
              query={query}
              pending={pending}
            />
          </TabsContent>
        </Tabs>
      </main>
    </article>
  );
}
