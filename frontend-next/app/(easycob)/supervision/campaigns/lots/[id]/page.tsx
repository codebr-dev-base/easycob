import { handlerError } from "@/app/lib/error";
import ContainerLot from "../../components/ContainerLot";
import { fetchLots } from "../../service/lots";
import { redirect } from "next/navigation";
import { fetchCampaign } from "../../service/campaigns";
import { fetchUserByModule } from "@/app/(easycob)/admin/users/service/users";
import { IUser } from "@/app/interfaces/auth";

export default async function Lots({ params }: { params: { id: string } }) {
  try {
    let operators: IUser[] = [];

    const [campaign, lots, supervisors, admins] = await Promise.all([
      fetchCampaign(params.id),
      fetchLots(params.id),
      fetchUserByModule("supervisor", true),
      fetchUserByModule("admin", true),
    ]);

    if (Array.isArray(supervisors) && Array.isArray(admins)) {
      operators = [...supervisors];
    }
    return (
      <ContainerLot lots={lots} campaign={campaign} operators={operators} />
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Unauthorized") {
        redirect("/logout");
      }
    }
  }
}