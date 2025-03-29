import { redirect } from "next/navigation";
import ContainerAction from "./components/ContainerAction";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";

export default async function Actions() {
  try {
    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerAction />
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
