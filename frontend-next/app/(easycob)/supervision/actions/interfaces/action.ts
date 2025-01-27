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
  nomLoja?: string; // Nome da loja (ou null)
}

export interface IReturnType {
  retornotexto: string;
}

export interface ISubsidiary {
  nomLoja: string;
  name: string;
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

// Interface para representar cada ação individual do usuário
export interface IUserAndTypes {
  id: number | string;
  typeActionId: number;
  name: string; // Nome completo do tipo de acionamento
  abbreviation: string; // Abreviação do acionamento (ex: ACP, ALE)
  quant: number; // Quantidade de ocorrências desse acionamento
  commissioned: number;
  cpc: string;
  ncpc: string;
  active: number;   // Contagem de ações do tipo 'active'
  dialer: number;   // Contagem de ações do tipo 'dialer'
  whatsapp: number; // Contagem de ações do tipo 'whatsapp'
  nullChannel: number;     // Contagem de ações onde 'channel' é NULL
}

// Interface para representar um usuário e suas ações
export interface IUserAndTypesData {
  userName: string; // Nome do usuário
  id: number | string; // ID do usuário
  total: number; // Total de ações do usuário
  actions: IUserAndTypes[]; // Lista de ações do usuário
}

export interface IUserAndCpc {
  userName: string;
  userId: number;
  total: string;
  cpc: string;
  ncpc: string;
}

export interface IUserChannel {
  userName: string;      // Nome do usuário
  userId: number;        // ID do usuário
  total: number;         // Total de ações realizadas
  activeCount: number;   // Contagem de ações do tipo 'active'
  dialerCount: number;   // Contagem de ações do tipo 'dialer'
  whatsappCount: number; // Contagem de ações do tipo 'whatsapp'
  nullCount: number;     // Contagem de ações onde 'channel' é NULL
}

// Representa um item individual no chartData
export interface IChartDataChannelItem {
  name: string;         // Nome do usuário
  total: number;        // Total de ações realizadas
  active: number;       // Contagem de ações do tipo 'active'
  dialer: number;       // Contagem de ações do tipo 'dialer'
  whatsapp: number;     // Contagem de ações do tipo 'whatsapp'
  nullChannel: number;  // Contagem de ações onde 'channel' é NULL
}

// Representa a configuração de um rótulo no gráfico
export interface IChartConfigChannelLabel {
  label: string; // Nome exibido no gráfico
}

// Representa a configuração completa dos rótulos do gráfico
export interface IChartChannelConfig {
  total: IChartConfigChannelLabel;
  active: IChartConfigChannelLabel;
  dialer: IChartConfigChannelLabel;
  whatsapp: IChartConfigChannelLabel;
  nullChannel: IChartConfigChannelLabel;
  [key: string]: IChartConfigChannelLabel; // Permite chaves dinâmicas, como 'usuario_1', 'usuario_2'
}

// Representa a resposta completa do servidor
export interface IChartChannelResponse {
  chartData: IChartDataChannelItem[]; // Lista de dados para o gráfico
  chartConfig: IChartChannelConfig;  // Configuração dos rótulos do gráfico
}