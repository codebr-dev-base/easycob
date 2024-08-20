export const isEmpty = (val: any) => !!val || "Campo obrigatório!";

export const isMin = (val: any, min: number = 3) =>
  val.length >= min || `O campo deve ter no mínimo ${min} caracteres`;

export const isMax = (val: any, max: number = 10) =>
  val.length <= max || "Campo obrigatório!";

export const isEmptyCurrencies = (val: any) =>
  val != "R$ 0,00" || "Campo obrigatório!";
