import { fetchAuth } from "@/app/lib/fetchAuth";
import { IFormTemplateValues, ITemplateSms } from "../interfaces/campaign";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/campaign";
const url = `${apiUrl}${urn}`;

export const createTemplate = async (
    template: IFormTemplateValues
  ): Promise<ITemplateSms[]> => {
    const result = await fetchAuth(`${url}/template/sms`, {
      method: "POST",
      body: JSON.stringify(template),
    });
  
    if (result.success) {
      //console.log("Dados recebidos:", result.data);
      return result.data;
    } else {
      //console.error("Erro ao buscar dados:", result.error);
      throw new Error(result.error);
    }
  };
  
  export const updateTemplate = async (
    template: IFormTemplateValues
  ): Promise<ITemplateSms[]> => {
    const result = await fetchAuth(`${url}/template/sms/${template.id}`, {
      method: "PUT",
      body: JSON.stringify(template),
    });
  
    if (result.success) {
      //console.log("Dados recebidos:", result.data);
      return result.data;
    } else {
      //console.error("Erro ao buscar dados:", result.error);
      throw new Error(result.error);
    }
  };
  
  export const fetchTemplate = async (): Promise<ITemplateSms[]> => {
    const result = await fetchAuth(`${url}/template/sms`);
  
    if (result.success) {
      //console.log("Dados recebidos:", result.data);
      return result.data;
    } else {
      //console.error("Erro ao buscar dados:", result.error);
      throw new Error(result.error);
    }
  };