import { redirect } from "next/navigation";
import {
  fetchInvoices,
  fetchNegotiations,
  fetchPromises,
} from "./service/discounts";
import ContainerDiscount from "./components/ContainerDiscount";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import { Suspense } from "react";

export default async function Discounts() {
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
