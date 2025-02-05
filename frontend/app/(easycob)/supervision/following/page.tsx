import { redirect } from "next/navigation";
import ContainerDiscount from "./components/ContainerDiscount";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import { Suspense } from "react";
import { fetchNegotiations } from "./service/negotiations";
import { fetchPromises } from "./service/promises";
import { fetchInvoices } from "./service/invoices";

export default async function Following() {
  try {
    const [negotiations, promises, invoices] = await Promise.all([
      fetchNegotiations(),
      fetchPromises(),
      fetchInvoices(),
    ]);

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerDiscount
          negotiations={negotiations}
          promises={promises}
          invoices={invoices}
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
