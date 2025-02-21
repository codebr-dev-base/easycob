"use client";
import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import {
  fetchActions,
  fetchCsvActions,
  fetchChartType,
  fetchChartUser,
  fetchChartUserAndChannel,
  fetchChartUserAndCpc,
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
import {
  IActionsResponse,
  IChartChannelConfig,
  IChartConfig,
  IChartData,
  IChartDataChannelItem,
  IChartDataStack,
} from "../interfaces/action";
import { Button } from "@/components/ui/button";
import { TbFileTypeCsv } from "react-icons/tb";
import { Parser } from "json2csv";
import { FaSpinner } from "react-icons/fa";

export default function ContainerAction({
  actions,
  //chartType: ct,
  //chartUser: cu,
  //chartUserType: cut,
  //chartUserCpc: cuc,
  //chartUserChannel: cuch,
}: {
  actions: {
    meta: IMeta;
    data: IAction[];
  };
/*   chartType: {
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
  chartUserCpc: {
    chartData: IChartDataStack[];
    chartConfig: IChartConfig;
  };
  chartUserChannel: {
    chartData: IChartDataChannelItem[]; // Lista de dados para o gráfico
    chartConfig: IChartChannelConfig;
  }; */
}) {
  const [meta, setMeta] = useState<IMeta>(actions.meta);
  const [data, setData] = useState<IAction[]>(actions.data ? actions.data : []);
  const [pendingRecords, setPendingRecords] = useState<boolean>(false);
  const [pendingChartType, setPendingChartType] = useState<boolean>(false);
  const [pendingChartUser, setPendingChartUser] = useState<boolean>(false);
  const [pendingChartUserType, setPendingChartUserType] =
    useState<boolean>(false);
  const [pendingChartUserCpc, setPendingChartUserCpc] =
    useState<boolean>(false);
  const [pendingChartUserChannel, setPendingChartUserChannel] =
    useState<boolean>(false);
  const [pendingCsv, setPendingCsv] = useState<boolean>(false);

/*   const [chartType, setChartType] = useState<{
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

  const [chartUserCpc, setChartUserCpc] = useState<{
    chartData: IChartDataStack[];
    chartConfig: IChartConfig;
  }>(cuc);

  const [chartUserChannel, setChartUserChannel] = useState<{
    chartData: IChartDataChannelItem[]; // Lista de dados para o gráfico
    chartConfig: IChartChannelConfig;
  }>(cuch); */

  const refresh = async () => {
    setPendingRecords(true);
    setPendingChartType(true);
    setPendingChartUser(true);
    setPendingChartUserType(true);
    setPendingChartUserCpc(true);
    setPendingChartUserChannel(true);
/* 
    fetchChartType().then((res) => {
      setChartType(res);
      setPendingChartType(false);
    });

    fetchChartUser().then((res) => {
      setChartUser(res);
      setPendingChartUser(false);
    });

    fetchChartUserAndType().then((res) => {
      setChartUserType(res);
      setPendingChartUserType(false);
    });

    fetchChartUserAndCpc().then((res) => {
      setChartUserCpc(res);
      setPendingChartUserCpc(false);
    });

    fetchChartUserAndChannel().then((res) => {
      setChartUserChannel(res);
      setPendingChartUserChannel(false);
    }); */

    fetchActions().then((res) => {
      setMeta(res.meta);
      setData(res.data);
      setPendingRecords(false);
    });
  };

  const converterParaCSV = (dados: IActionsResponse[]): void => {
    const campos: (keyof IActionsResponse)[] = Object.keys(
      dados[0]
    ) as (keyof IActionsResponse)[];
    const parser = new Parser({ fields: campos });
    const csv = parser.parse(dados);

    // Cria um link para download do arquivo CSV
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "dados.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchCsv = async () => {
    setPendingCsv(true);
    const data = await fetchCsvActions();
    converterParaCSV(data);
    setPendingCsv(false);
  };

  useEffect(() => {
    query.page = 1;
    query.perPage = 10;
    query.orderBy = "id";
    query.descending = false;
    query.startDate = new Date().toISOString().split("T")[0];
    query.endDate = new Date().toISOString().split("T")[0];
    query.keywordColumn = "cliente";

    return () => {
      query.page = 1;
      query.perPage = 10;
      query.orderBy = "id";
      query.descending = false;
      query.startDate = new Date().toISOString().split("T")[0];
      query.endDate = new Date().toISOString().split("T")[0];
      query.keywordColumn = "cliente";
    };
  }, []);

  return (
    <article className="max-w-full">
      <div className="p-2">
        <Header title="Acionamentos">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <Button variant="secondary" onClick={fetchCsv} disabled={pendingCsv}>
              {pendingCsv ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <TbFileTypeCsv />
              )}
            </Button>
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
 {/*            <TabChart
              chartType={chartType}
              pendingChartType={pendingChartType}
              chartUser={chartUser}
              pendingChartUser={pendingChartUser}
              chartUserType={chartUserType}
              pendingChartUserType={pendingChartUserType}
              chartUserCpc={chartUserCpc}
              pendingChartUserCpc={pendingChartUserCpc}
              chartUserChannel={chartUserChannel}
              pendingChartUserChannel={pendingChartUserChannel}
              query={query}
            /> */}
          </TabsContent>
          <TabsContent value="records">
            <TabRecords
              meta={meta}
              data={data}
              refresh={refresh}
              query={query}
              pending={pendingRecords}
            />
          </TabsContent>
        </Tabs>
      </main>
    </article>
  );
}
