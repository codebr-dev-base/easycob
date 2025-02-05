import { ISkillModule } from "@/app/interfaces/auth";
import { fetchAuth } from "@/app/lib/fetchAuth";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/auth/module";
const url = `${apiUrl}${urn}`;

export let query = {
  skill: 'full'
};

// Função para atualizar `query

export const fetchModules = async (): Promise<ISkillModule[]> => {
  const result = await fetchAuth(url, {
    query,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

