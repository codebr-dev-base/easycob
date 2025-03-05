import * as dotEnv from "dotenv";
import { useCallback, useState } from "react";
import {
  IContact,
  IContacts,
} from "../interfaces/contracts";
import { fetchAuth } from "@/app/lib/fetchAuth";


dotEnv.config();

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const urn = "/v1/base/external/contact";
const baseUrl = `${apiUrl}${urn}`;

const useContactService = (initialData: IContacts) => {
  const [contacts, setContacts] = useState<IContacts>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async (desContr: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IContacts>(
        `${baseUrl}/client/${desContr}`
      );
      if (result.success && result.data) {
        setContacts(result.data);
      } else {
        setError(result.error || "Falha ao buscar usuários.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createContact = async (data: IContact) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IContact>(baseUrl, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (result.success && result.data) {
        if (result.data.tipoContato === "TELEFONE") {
          setContacts({
            phones: [result.data, ...contacts.phones],
            emails: contacts.emails,
          });
        } else {
          setContacts({
            phones: contacts.phones,
            emails: [result.data, ...contacts.emails],
          });
        }
      } else {
        setError(result.error || "Falha ao buscar usuários.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContact = async (data: IContact) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const result = await fetchAuth<IContact>(`${baseUrl}/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
  
      if (result.success && result.data) {
        setContacts((prevContacts) => ({
          phones: data.tipoContato === "TELEFONE"
            ? prevContacts.phones.map((phone) =>
                phone.id === data.id ? result.data! : phone
              )
            : prevContacts.phones,
  
          emails: data.tipoContato !== "TELEFONE"
            ? prevContacts.emails.map((email) =>
                email.id === data.id ? result.data! : email
              )
            : prevContacts.emails,
        }));
      } else {
        setError(result.error || "Falha ao atualizar o contato.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  

  return {
    contacts,
    setContacts,
    createContact,
    updateContact,
    isLoading,
    error,
    fetchContacts,
  };
};

export default useContactService;
