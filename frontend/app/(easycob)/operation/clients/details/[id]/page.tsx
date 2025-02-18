import { fetchClient } from "../../service/clients";
import { fetchContacts } from "../../service/contacts";
import ConteinerDetails from "./components/ConteinerDetails";
import { fetchContracts } from "../../service/contracts";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Details({ params }: { params: { id: string } }) {
  try {
    const [client, contacts, contracts] =
      await Promise.all([
        fetchClient(params.id),
        fetchContacts(params.id),
        fetchContracts(params.id),
      ]);

    return (
      <article className="max-w-full">
        <main className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Suspense fallback={<p>Loading...</p>}>
          <ConteinerDetails
            contacts={contacts}
            client={client}
            contracts={contracts}
          />
          </Suspense>
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
