import { redirect } from "next/navigation";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import ContainerLoyal from "./components/ContainerLoyal";
import { fetchLoyals } from "./service/loyals";

export default async function Loyals() {
  try {
    const [loyals] = await Promise.all([fetchLoyals()]);
    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerLoyal loyals={loyals} />
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
