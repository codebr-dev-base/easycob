import { redirect } from "next/navigation";
import {
  fetchActions,
  fetchChartType,
  fetchChartUser,
  fetchChartUserAndType,
  fetchChartUserAndCpc,
  fetchChartUserAndChannel
} from "./service/actions";
import ContainerAction from "./components/ContainerAction";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";

export default async function Actions() {
  try {
    const [actions, chartType, chartUser, chartUserType, chartUserCpc, chartUserChannel] = await Promise.all([
      fetchActions(),
      fetchChartType(),
      fetchChartUser(),
      fetchChartUserAndType(),
      fetchChartUserAndCpc(),
      fetchChartUserAndChannel()
    ]);

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerAction
          actions={actions}
          chartType={chartType}
          chartUser={chartUser}
          chartUserType={chartUserType}
          chartUserCpc={chartUserCpc}
          chartUserChannel={chartUserChannel}
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
