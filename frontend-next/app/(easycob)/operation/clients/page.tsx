import { redirect } from "next/navigation";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import { fetchClients } from "./service/clients";
import ContainerClient from "./components/ContainerClient";

export default async function Clients() {
  try {
    const [clients] = await Promise.all([fetchClients()]);

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerClient clients={clients} />
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
