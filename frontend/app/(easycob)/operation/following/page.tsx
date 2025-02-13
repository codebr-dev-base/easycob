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

let initialNegotiationOfPayment: IPaginationResponse<INegotiationOfPayment> | null =
  null;
let initialAgreement: IPaginationResponse<IPromiseOfPayment> | null = null;
let initialNegotiationInvoice: IPaginationResponse<INegotiationInvoice> | null =
  null;
let initialPromise: IPaginationResponse<IPromiseOfPayment> | null = null;

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
    if (!initialNegotiationOfPayment)
      initialNegotiationOfPayment = await fetchNegotiations(initialQuery);
    if (!initialAgreement)
      initialAgreement = await fetchPromises({
        ...initialQuery,
        typeActionIds: 1,
      });
    if (!initialNegotiationInvoice)
      initialNegotiationInvoice = await fetchInvoices(initialQuery);
    if (!initialPromise)
      initialPromise = await fetchPromises({
        ...initialQuery,
        typeActionIds: 2,
      });

    if (
      !initialNegotiationOfPayment ||
      !initialAgreement ||
      !initialNegotiationInvoice ||
      !initialPromise
    ) {
      return (
        <div className="w-full h-full">
          <span>Api indisponivel</span>
        </div>
      );
    }

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerFollowings
          initialNegotiationOfPayment={initialNegotiationOfPayment}
          initialAgreement={initialAgreement}
          initialNegotiationInvoice={initialNegotiationInvoice}
          initialPromise={initialPromise}
          initialQuery={initialQuery}
        />
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
