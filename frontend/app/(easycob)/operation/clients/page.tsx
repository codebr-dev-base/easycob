import { redirect } from "next/navigation";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import { fetchClients } from "./service/clients";
import ContainerClient from "./components/ContainerClient";
import { IClient } from "@/app/(easycob)/interfaces/clients";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { IQueryClienteParams } from "./interfaces/cliente";

let clients: IPaginationResponse<IClient> | null = null;
const initialQuery: IQueryClienteParams = {
  page: 1,
  perPage: 10,
  orderBy: "dtUpdate",
  descending: false,
  keywordColumn: "nomClien",
  status: "ATIVO",
};

export default async function Clients() {
  try {
    if (!clients) clients = await fetchClients(initialQuery);

    if (!clients) {
      return (
        <div className="w-full h-full">
          <span>Api indisponivel</span>
        </div>
      );
    }

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerClient initialData={clients} initialQuery={initialQuery} />
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
