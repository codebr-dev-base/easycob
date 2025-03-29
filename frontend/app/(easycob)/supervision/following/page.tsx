import { redirect } from "next/navigation";
import ContainerDiscount from "./components/ContainerDiscount";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import { Suspense } from "react";

export default async function Following() {
  try {
    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerDiscount />
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
