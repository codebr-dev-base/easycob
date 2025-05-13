import { redirect } from "next/navigation";
import ContainerDiscount from "./components/ContainerDiscount";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import { Suspense } from "react";
import { IQueryDiscountParams } from "./interfaces/discounts";

const initialQuery: IQueryDiscountParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  descending: false,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
};

export default async function Following() {
  try {
    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerDiscount initialQuery={initialQuery}/>
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
