import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IContact, IContacts, IContract } from "../../../interfaces/contracts";
import { formatDateToBR, formatStringToCpfCnpj } from "@/app/lib/utils";
import { TabsContacts } from "./TabsContacts";
import { GoAlert } from "react-icons/go";

interface IPropsCardContract {
  children: React.ReactNode;
  contract: IContract;
  contacts: IContacts;
  selectContact: IContact | null;
  setSelectContact: (value: IContact | null) => void;
  createContact: (contact: IContact) => Promise<void>;
  updateContact: (contact: IContact) => Promise<void>;
}

export default function CardContract({
  children,
  contract,
  contacts,
  selectContact,
  setSelectContact,
  createContact,
  updateContact,
}: IPropsCardContract) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <div>Detalhes do Contrato</div>
          </div>
        </CardTitle>
        <CardDescription className="flex">
          <span>Status: {contract.status}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">
            {contract.nomCliente}
          </p>
          {contract.numDoc1 && (
            <p className="text-sm text-muted-foreground">
              CFP/CNPJ: {formatStringToCpfCnpj(contract.numDoc1)}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Maior período de vencimento: {contract.maiorAgingVencimento}
          </p>
          <p className="text-sm text-muted-foreground">
            Perfil de arrecadação: {contract.comportamentoArrecadacao6M}
          </p>
          <p className="text-sm text-muted-foreground">
            Status Adimplência: {contract.statusAdimplencia}
          </p>
          <p className="text-sm text-muted-foreground">
            Unidade: {contract.subsidiary?.name}
          </p>
          <TabsContacts
            contacts={contacts}
            selectContact={selectContact}
            setSelectContact={setSelectContact}
            desContr={contract.desContr}
            createContact={createContact}
            updateContact={updateContact}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p>Atualizado em: {formatDateToBR(`${contract.updatedAt}`)} </p>
        {children}
      </CardFooter>
    </Card>
  );
}
