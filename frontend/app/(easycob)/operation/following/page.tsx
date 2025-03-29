import { redirect } from "next/navigation";
import ContainerFollowings from "./components/ContainerFollowings";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import { Suspense } from "react";
import { fetchNegotiations } from "./service/negotiations";
import { fetchPromises } from "./service/promises";
import { fetchInvoices } from "./service/invoices";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import {
  INegotiationInvoice,
  INegotiationOfPayment,
  IPromiseOfPayment,
} from "../../interfaces/actions";
import { IQueryFollowingParams } from "./interfaces/following";

const initialQuery: IQueryFollowingParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
};

export default async function Followings() {
  try {
    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerFollowings initialQuery={initialQuery} />
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
