import { IPaginationResponse } from "@/app/interfaces/pagination";
import { IContract, IQueryContractParams } from "./interfaces/contracts";
import { fetchAuth } from "@/app/lib/fetchAuth";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import { redirect } from "next/navigation";
import ContainerContract from "./components/ContainerContract";
import * as dotEnv from "dotenv";
dotEnv.config();

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/base/external/contract";
const url = `${apiUrl}${urn}`;

export const fetchContracts = async (
  initialQuery: IQueryContractParams
): Promise<IPaginationResponse<IContract>> => {
  const result = await fetchAuth(url, {
    query: initialQuery,
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

let contracts: IPaginationResponse<IContract> | null = null;
const initialQuery: IQueryContractParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  keywordColumn: "nomCliente",
  status: "ativo",
};
export default async function Page() {
  try {
    contracts = await fetchContracts(initialQuery);

    if (!contracts) {
      return (
        <div className="w-full h-full">
          <span>Api indisponivel</span>
        </div>
      );
    }

    return (
      
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerContract initialData={contracts} initialQuery={initialQuery} />
      </Suspense>
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Unauthorized") {
        redirect("/logout");
      }
    }
  }
}
