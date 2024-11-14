"use client";
import { formatDateToBR, rgbToRgba } from "../../../../lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  IChartConfig,
  IChartData,
  IChartDataStack,
  IQueryActionParams,
} from "../interfaces/action";
import {
  getColorVariation,
  getInverseColor,
  getRandomColor,
} from "@/app/lib/utils";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export const description = "A mixed bar chart";

export default function TabChart({
  chartType,
  chartUser,
  chartUserType,
  chartUserCpc,
  query,
}: {
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
  chartUserCpc: {
    chartData: IChartDataStack[];
    chartConfig: IChartConfig;
  };
  query: IQueryActionParams;
}) {
  const actionKeys = Array.from(
    new Set(
      chartUserType.chartData.flatMap((item) =>
        Object.keys(item).filter(
          (key) => key !== "userId" && key !== "name" && key !== "total"
        )
      )
    )
  );

  let color = `rgb(34, 105, 211)`;
  let inverseColor = getInverseColor(`rgb(34, 105, 211)`);

  return (
    <>
      <div className="grid grid-cols-1 gap-1 md:grid-cols-3 md:gap-3 mb-2">
        <Card>
          <CardHeader>
            <CardTitle>Acionamentos</CardTitle>
            <CardDescription>
              Classificação por tipo de acionamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartType.chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartType.chartData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />

                <YAxis
                  dataKey="abbreviation"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    return value;
                  }}
                />

                <XAxis dataKey="total" type="number" />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />

                <Bar dataKey="total" layout="vertical" radius={4}>
                  <LabelList
                    dataKey="name"
                    position="insideLeft"
                    offset={5}
                    className="fill-[--color-label]"
                    fontSize={12}
                    width={680}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Perído de valiação:
            </div>
            <div className="leading-none text-muted-foreground">
              {`${formatDateToBR(query.startDate)} - ${formatDateToBR(
                query.endDate
              )}`}
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Acionamentos</CardTitle>
            <CardDescription>Classificação por operador</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartUser.chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartUser.chartData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />

                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    return value;
                  }}
                  hide
                />

                <XAxis dataKey="total" type="number" />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />

                <Bar dataKey="total" layout="vertical" radius={4}>
                  <LabelList
                    dataKey="name"
                    position="insideLeft"
                    offset={5}
                    className="fill-[--color-label]"
                    fontSize={12}
                    width={680}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Perído de valiação:
            </div>
            <div className="leading-none text-muted-foreground">
              {`${formatDateToBR(query.startDate)} - ${formatDateToBR(
                query.endDate
              )}`}
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Acionamentos</CardTitle>
            <CardDescription>Classificação por operador e tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartUserType.chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartUserType.chartData}
                layout="vertical"
              >
                <CartesianGrid horizontal={false} />

                <YAxis
                  dataKey="name"
                  type="category"
                  tickFormatter={(value) => {
                    return value;
                  }}
                  hide
                />

                <XAxis dataKey="total" type="number" />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="total" stackId="b" fill="transparent">
                  <LabelList
                    dataKey="name"
                    position="insideLeft"
                    offset={5}
                    className="fill-[--color-label]"
                    fontSize={12}
                    width={680}
                  />
                </Bar>
                {actionKeys.map((key: string, index: number): any => {
                  if (index % 2 == 0) {
                    color = getColorVariation(color, 1.4);
                    return (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="a"
                        fill={rgbToRgba(color, 0.8)}
                      />
                    );
                  } else {
                    inverseColor = getInverseColor(color);

                    return (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="a"
                        fill={rgbToRgba(inverseColor, 0.6)}
                      />
                    );
                  }

                  /* Add a bar just for the gap after each bar */
                  /*  bars.push(<Bar dataKey="gap" stackId="a" fill="transparent" />); */
                })}
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Perído de valiação:
              </div>
              <div className="leading-none text-muted-foreground">
                {`${formatDateToBR(query.startDate)} - ${formatDateToBR(
                  query.endDate
                )}`}
              </div>
            </div>

            <Button variant={"outline"} asChild>
              <Link href="/supervision/actions/type"> Tabela </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-1 md:grid-cols-3 md:gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Acionamentos</CardTitle>
            <CardDescription>Classificação por CPC</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartUserCpc.chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartUserCpc.chartData}
                layout="vertical"
              >
                <CartesianGrid horizontal={false} />

                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={true}
                  tickMargin={1}
                  axisLine={true}
                  tickFormatter={(value) => {
                    return value.slice(0, 5) + ".";
                  }}
                  fontSize={8}
                />

                <XAxis dataKey="total" type="number" />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />

                <Bar
                  dataKey="CPC"
                  layout="vertical"
                  fill="rgba(34, 105, 211, 1)"
                  radius={4}
                />

                <Bar
                  dataKey="NCPC"
                  layout="vertical"
                  fill="rgba(34, 105, 211, .5)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Perído de valiação:
            </div>
            <div className="leading-none text-muted-foreground">
              {`${formatDateToBR(query.startDate)} - ${formatDateToBR(
                query.endDate
              )}`}
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Acionamentos</CardTitle>
            <CardDescription>Classificação por CPC</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartUserCpc.chartConfig}>
              <BarChart accessibilityLayer data={chartUserCpc.chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 6) + "."}
                  fontSize={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="CPC" fill="rgba(34, 105, 211, 1)" radius={4} />
                <Bar dataKey="NCPC" fill="rgba(34, 105, 211, .5)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Perído de valiação:
            </div>
            <div className="leading-none text-muted-foreground">
              {`${formatDateToBR(query.startDate)} - ${formatDateToBR(
                query.endDate
              )}`}
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
