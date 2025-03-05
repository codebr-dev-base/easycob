//import ConteinerDetails from "./components/ConteinerDetails";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import * as dotEnv from "dotenv";
import { IContact, IContract } from "../../interfaces/contracts";
import { fetchAuth } from "@/app/lib/fetchAuth";
import ConteinerDetails from "./components/ConteinerDetails";
dotEnv.config();

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const urn = "/v1/base/external/contract";
const url = `${apiUrl}${urn}`;

let contract: IContract | null = null;
let contacts: IContact[] | null = null;

export const fetchContract = async (id: string): Promise<IContract> => {
  const result = await fetchAuth(`${url}/${id}`, {
    method: "GET",
  });

  if (result.success) {
    //console.log("Dados recebidos:", result.data);
    return result.data;
  } else {
    //console.error("Erro ao buscar dados:", result.error);
    throw new Error(result.error);
  }
};

export default async function Page({ params }: { params: { id: string } }) {
  try {
    contract = await fetchContract(params.id);
    console.log(contract);

    return (
      <article className="max-w-full">
        <main className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Suspense fallback={<p>Loading...</p>}>
            <ConteinerDetails contract={contract} />
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
