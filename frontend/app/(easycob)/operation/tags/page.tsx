import { fetchAuth } from "@/app/lib/fetchAuth";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { IQueryTagClientParams, ITag } from "./interfaces/tag";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import ContainerTag from "./components/ContainerTag";
import { IClient } from "../../interfaces/clients";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/tag";
const url = `${apiUrl}${urn}`;

const initialQuery: IQueryTagClientParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
};

const fetchTags = async (): Promise<ITag[]> => {
  const result = await fetchAuth(url);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

const fetchClients = async (
  id: number | string
): Promise<IPaginationResponse<IClient>> => {
  const result = await fetchAuth(`${url}/clients/paginated`, {
    query: { ...initialQuery, tagId: id },
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

let tags: ITag[] | null = null;
let initialData: IPaginationResponse<IClient> | null = null;

export default async function Page() {
  try {
    if (!tags) tags = await fetchTags();
    if (!initialData) initialData = await fetchClients(tags[0].id);

    if (!tags || !initialData) {
      return (
        <div className="w-full h-full">
          <span>Api indisponível</span>
        </div>
      );
    }

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <div className="w-full h-full">
          <ContainerTag
            tags={tags}
            initialData={initialData}
            initialQuery={{ ...initialQuery, tagId: tags[0].id }}
          />
        </div>
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
