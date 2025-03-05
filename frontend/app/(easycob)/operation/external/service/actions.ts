import { IAction } from "@/app/(easycob)/interfaces/actions";
import { fetchAuth } from "@/app/lib/fetchAuth";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/action";
const url = `${apiUrl}${urn}`;

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
