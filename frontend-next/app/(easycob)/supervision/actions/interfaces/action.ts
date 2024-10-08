import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IQueryActionParams extends IQueryPaginationParams {
  sync?: boolean; // Filtro para itens sincronizados (ou null)
  keyword?: string; // Palavra-chave de busca
  keywordColumn?: string; // Coluna específica para busca (ou null)
  startDate: string; // Data de início (pode ser string ISO ou null)
  endDate: string; // Data de fim (pode ser string ISO ou null)
  userId?: string; // ID do usuário (ou null)
  typeActionIds?: number[] | string[] | string; // Lista de IDs de tipos de ações
  returnType?: string; // Tipo de retorno (ou null)
}

export interface IReturnType {
  retornotexto: string;
}

export interface IChartData {
  name: string; // Nome do tipo de ação (ex: "chrome", "safari")
  total: number; // Quantidade de acionamentos para o tipo
  fill: string; // Cor associada ao tipo de ação
}

export interface IChartConfig {
  [x: string]: {
    label?: any;
    icon?: React.ComponentType;
  } & (
    | {
        color?: string;
        theme?: never;
      }
    | {
        color?: never;
        theme: Record<"light" | "dark", string>;
      }
  );
}

export interface IChartDataStack {
  userId: number;
  userName: string;
  actions: { type_action: string; total: number }[];
  total?: number | null;
}

interface ChartConfigItem {
  label: string;
  color: string;
}

interface ChartConfig {
  [key: string]: ChartConfigItem;
}

interface ChartResponse {
  chartData: IChartData[];
  chartConfig: ChartConfig;
}
