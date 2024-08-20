import { patterns } from "quasar";
const { testPattern } = patterns;

//const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//const regexEmail2 = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;

const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;

const regexPassword2 =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const isMax = (val: any, max: number = 10) =>
  val.length <= max || "Campo obrigatório!";

export const isPassword = (val: string) =>
  regexPassword2.test(val) || "Senha inválida";
