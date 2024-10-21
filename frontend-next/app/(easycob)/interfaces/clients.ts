import { IAction } from "./actions";

export interface IInvoice {
    id?: number;
    dtUpdate?: string; // Data como string no formato ISO
    datMovto?: string; // Data como string no formato ISO
    codCredorDesRegis?: number | string;
    matriculaContrato?: number;
    codCredor?: string;
    desRegis?: string;
    desContr?: string;
    datVenci?: string; // Data como string no formato ISO
    datCorre?: string; // Data como string no formato ISO
    datPagam?: string; // Data como string no formato ISO
    valPrinc?: number;
    valCorre?: number;
    valEncar?: number;
    valMinim?: number;
    valPago?: number;
    qtdPrest?: string;
    indAlter?: string;
    indBaixa?: string;
    idPrest?: number;
    descCodMovimento?: string;
    identificadorBaixa?: string;
    status?: string;
    matriculaAntiga?: string;
  }

  export interface IContact {
    id?: number;
    codCredorDesRegis?: number | string;
    tipoContato?: string;
    contato?: string;
    dtImport?: string; // Data como string no formato ISO
    isWhatsapp?: boolean;
    cpc?: boolean;
    numeroWhats?: string;
    block?: boolean;
    blockAll?: boolean;
    percentualAtender?: number;
    countAtender?: number;
    updatedAt?: string; // Data como string no formato ISO
  }

  export interface IClient {
    id?: number;
    dtUpdate?: string; // Data como string no formato ISO
    datMovto?: string; // Data como string no formato ISO
    codCredorDesRegis?: number | string;
    codCredor?: string;
    desRegis?: string;
    indAlter?: string;
    desCpf?: string;
    nomClien?: string;
    datNasci?: string; // Data como string no formato ISO
    desEnderResid?: string;
    desNumerResid?: string;
    desComplResid?: string;
    desBairrResid?: string;
    desCidadResid?: string;
    desEstadResid?: string;
    desCepResid?: string;
    desFonesResid?: string;
    desFonesComer?: string;
    codRamalComer?: string;
    datRefer?: string; // Data como string no formato ISO
    datExpirPrazo?: string; // Data como string no formato ISO
    datCadasClien?: string; // Data como string no formato ISO
    datAdmis?: string; // Data como string no formato ISO
    desFonesCelul?: string;
    desFones1?: string;
    desFones2?: string;
    desEmail?: string;
    descCodMovimento?: string;
    status?: string;
    contracts?: IContract[]
    phones?: IContact[]
    emails?: IContact[]
  }

  export interface IContract {
    id?: number;
    dtUpdate?: string; // Data como string no formato ISO
    datMovto?: string; // Data como string no formato ISO
    codCredorDesRegis?: number | string;
    matriculaContrato?: number;
    codCredor?: string;
    desRegis?: string;
    desContr?: string;
    nomFilia?: string;
    nomRede?: string;
    valCompr?: string;
    valEntra?: string;
    datIniciContr?: string; // Data como string no formato ISO
    qtdPrest?: number;
    indAlter?: string;
    descCodMovimento?: string;
    nomLoja?: string;
    status?: string;
    matriculaAntiga?: string;
  
    // Relacionamentos
    client?: IClient; // Adicione a interface IClient se necessário
    actions?: IAction[]; // Adicione a interface IAction se necessário
  }