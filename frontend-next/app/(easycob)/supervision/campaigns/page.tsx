import { IUser } from "@/app/interfaces/auth";
import { fetchUserByModule } from "../../admin/users/service/users";
import ContainerCampaign from "./components/ContainerCampaign";
import { fetchCampaigns } from "./service/campaigns";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";

export default async function Campaigns() {
  try {
    let operators: IUser[] = [];
    const [result, supervisors, admins] = await Promise.all([
      fetchCampaigns(),
      fetchUserByModule("supervisor", true),
      fetchUserByModule("admin", true),
    ]);

    if (Array.isArray(supervisors) && Array.isArray(admins)) {
      operators = [...supervisors];
    }

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerCampaign campaigns={result} operators={operators} />
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
