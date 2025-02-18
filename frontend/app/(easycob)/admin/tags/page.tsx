import { fetchAuth } from "@/app/lib/fetchAuth";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { ITag } from "./interfaces/tag";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import ContainerTag from "./components/ContainerTag";

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/tag";
const url = `${apiUrl}${urn}`;

export const fetchTags = async (): Promise<ITag[]> => {
  const result = await fetchAuth(url);

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

let tags: ITag[] | null = null;

export default async function Page() {
  try {
    if (!tags) tags = await fetchTags();

    console.log(tags);

    if (!tags) {
      return (
        <div className="w-full h-full">
          <span>Api indisponível</span>
        </div>
      );
    }

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <div className="w-full h-full">
          <ContainerTag initialData={tags} />
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
