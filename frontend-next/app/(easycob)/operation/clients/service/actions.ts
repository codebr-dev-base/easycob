import { IAction } from "@/app/(easycob)/interfaces/actions";
import { fetchAuth } from "@/app/lib/fetchAuth";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/action";
const url = `${apiUrl}${urn}`;

export const fetchActionsClient = async (
  codCredorDesRegis: String | Number
): Promise<IAction[]> => {
  const result = await fetchAuth(`${url}/client/${codCredorDesRegis}`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const createAction = async (action: any) => {
  const result = await fetchAuth<IAction>(`${url}`, {
    method: "POST",
    body: JSON.stringify(action),
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result;
  } else {
    throw result;
  }
};
