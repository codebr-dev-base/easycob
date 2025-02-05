import { fetchAuth } from "@/app/lib/fetchAuth";
import { IClient, IContact } from "@/app/(easycob)/interfaces/clients";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/recovery/contact";
const url = `${apiUrl}${urn}`;

export const fetchContacts = async (
  codCredorDesRegis: String | number
): Promise<{ phones: IContact[]; emails: IContact[] }> => {
  const result = await fetchAuth(`${url}/${codCredorDesRegis}`);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export const createContact = async (contact: any) => {
  const result = await fetchAuth<IContact>(`${url}`, {
    method: "POST",
    body: JSON.stringify(contact),
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result;
  } else {
    throw result;
  }
};

export const updateContact = async (contact: any) => {
  const result = await fetchAuth<IContact>(`${url}/${contact.id}`, {
    method: "PUT",
    body: JSON.stringify(contact),
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result;
  } else {
    throw result;
  }
};