import { redirect } from "next/navigation";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import ContainerLoyal from "./components/ContainerLoyal";
import { fetchLoyals } from "./service/loyals";
import { IQueryLoyalParams } from "./interfaces/loyal";
import { ILoyal } from "./interfaces/loyal";
import { IPaginationResponse } from "@/app/interfaces/pagination";

const initialQuery: IQueryLoyalParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  keywordColumn: "nomClien",
};

export default async function Loyals() {
  try {

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerLoyal initialQuery={initialQuery} />
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
