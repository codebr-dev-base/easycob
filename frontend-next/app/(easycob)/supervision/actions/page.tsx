import { redirect } from "next/navigation";
import {
  fetchActions,
  fetchChartType,
  fetchChartUser,
  fetchChartUserAndType,
  fetchReturnsTypes,
  fetchTypesActions,
} from "./service/actions";
import ContainerAction from "./components/ContainerAction";
import { Suspense } from "react";
import SkeletonFullPage from "../../components/SkeletonFullPage";

export default async function Actions() {
  try {
    const [actions, chartType, chartUser, chartUserType] = await Promise.all([
      fetchActions(),
      fetchChartType(),
      fetchChartUser(),
      fetchChartUserAndType()
    ]);

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ContainerAction
          actions={actions}
          chartType={chartType}
          chartUser={chartUser}
          chartUserType={chartUserType}
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
