import { fetchClient } from "../../service/clients";
import { fetchContacts } from "../../service/contacts";
import { fetchActionsClient } from "../../service/actions";
import { fetchTypesActions } from "@/app/(easycob)/supervision/actions/service/actions";
import ConteinerDetails from "./components/ConteinerDetails";
import { fetchContracts } from "../../service/contracts";
import { redirect } from "next/navigation";

export default async function Details({ params }: { params: { id: string } }) {
  try {
    const [client, contacts, actions, contracts, typesActions] =
      await Promise.all([
        fetchClient(params.id),
        fetchContacts(params.id),
        fetchActionsClient(params.id),
        fetchContracts(params.id),
        fetchTypesActions(),
      ]);

    return (
      <article className="max-w-full">
        <main className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ConteinerDetails
            actions={actions}
            contacts={contacts}
            client={client}
            contracts={contracts}
            typesActions={typesActions ? typesActions : []}
          />
        </main>
      </article>
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Unauthorized") {
        redirect("/logout");
      }
    }
  }
}
