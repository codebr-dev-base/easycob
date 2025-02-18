import { redirect } from "next/navigation";
import { Suspense } from "react";
import ConteinerUser from "./components/ConteinerUser";
import SkeletonFullPage from "../../components/SkeletonFullPage";
import { fetchUsers } from "./service/users";
import { fetchModules } from "./service/module";

export default async function Clients() {
  try {
    const [users, modules] = await Promise.all([fetchUsers(), fetchModules()]);

    return (
      <Suspense fallback={<SkeletonFullPage />}>
        <ConteinerUser users={users} modules={modules} />
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
