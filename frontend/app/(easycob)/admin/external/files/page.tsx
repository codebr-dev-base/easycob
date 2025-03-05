import { fetchAuth } from "@/app/lib/fetchAuth";
import * as dotEnv from "dotenv";
import { IPaginationResponse } from "../../../../interfaces/pagination";
import { IFile, IQueryFileParams } from "./interfaces/files";
import { Suspense } from "react";
import SkeletonFullPage from "@/app/(easycob)/components/SkeletonFullPage";
import { redirect } from "next/navigation";
import ContainerFiles from "./componentes/ContainerFiles";
dotEnv.config();

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const urn = "/v1/external/file";
const baseUrl = `${apiUrl}${urn}`;

const fetchFiles = async (query: IQueryFileParams) => {
  const result = await fetchAuth<IPaginationResponse<IFile>>(baseUrl, {
    query,
  });

  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error(result.error || "Falha ao buscar tags.");
  }
};

let files: IPaginationResponse<IFile> | null = null;
const initialQuery = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  keywordColumn: "fileName",
};

export default async function Page() {
  try {
    files = await fetchFiles(initialQuery);

    if (!files) {
      return (
        <div className="w-full h-full">
          <span>Api indisponível</span>
        </div>
      );
    }

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerFiles initialData={files} initialQuery={initialQuery} />
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
