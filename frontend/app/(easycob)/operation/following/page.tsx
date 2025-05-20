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

export default async function Followings() {
  try {
    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerFollowings />
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
