import Header from "@/app/(easycob)/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchClient } from "../../service/clients";
import { formatDateToBR, formatStringToCpfCnpj } from "@/app/lib/utils";
import { fetchContacts } from "../../service/contacts";
import { TabsContacts } from "../../components/TabsContacts";
export default async function Details({ params }: { params: { id: string } }) {
  const [client, contacts] = await Promise.all([
    fetchClient(params.id),
    fetchContacts(params.id),
  ]);

  return (
    <article className="max-w-full">
      <main className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do cliente</CardTitle>
            <CardDescription>Status: {client.status}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {client.nomClien}
              </p>
              {client.desCpf && (
                <p className="text-sm text-muted-foreground">
                  CFP/CNPJ: {formatStringToCpfCnpj(client.desCpf)}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Endereço: {client.desEnderResid}, {client.desNumerResid},{" "}
                {client.desComplResid}
              </p>
              <p className="text-sm text-muted-foreground">
                Bairro: {client.desBairrResid}
              </p>
              <p className="text-sm text-muted-foreground">
                Cidade: {client.desCidadResid} - {client.desEstadResid}
              </p>
              <TabsContacts constacts={contacts} />
            </div>
          </CardContent>
          <CardFooter>
            <p>Atualizado em: {formatDateToBR(`${client.dtUpdate}`)}</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </main>
    </article>
  );
}
