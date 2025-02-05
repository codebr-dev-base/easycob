import { IAction, ITypeAction } from "@/app/(easycob)/interfaces/actions";
import { IUser } from "@/app/interfaces/auth";
import { formatCurrencyToBRL, formatDateToBR } from "@/app/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

//import { FaHandshake } from "react-icons/fa";
import { FaRegHandshake, FaRegBell } from "react-icons/fa";
import { MdAlternateEmail, MdOutlineSms } from "react-icons/md";
import { formatarFone } from '../../../../../../lib/utils';

// Função de Type Guard para validar se um objeto é do tipo ITypeAction
function isTypeAction(obj: any): obj is ITypeAction {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "abbreviation" in obj &&
    "name" in obj &&
    "categoryActionId" in obj &&
    "createdAt" in obj &&
    "updatedAt" in obj
  );
}

// Função de Type Guard para validar se um objeto é do tipo IUser
function isUser(obj: any): obj is IUser {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "email" in obj &&
    "name" in obj &&
    "cpf" in obj &&
    "phone" in obj
  ); // Verifica se skills é um array
}

function Icon({ typeAction }: { typeAction: ITypeAction }) {
  const agreements = ["ACV", "ACA", "ACP"];

  if (agreements.includes(typeAction.abbreviation)) {
    return <FaRegHandshake />;
  }

  if (typeAction.abbreviation == "EME") {
    return <MdAlternateEmail />;
  }

  if (typeAction.abbreviation == "EME") {
    return <MdOutlineSms />;
  }

  return <FaRegBell />;
}
export default function CardAction({ action }: { action: IAction }) {
  if (isTypeAction(action.typeAction) && isUser(action.user)) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex">
            <span className="mr-2">
              <Icon typeAction={action.typeAction} />
            </span>
            {action.typeAction.name}
          </CardTitle>
          <CardDescription>{action.retornotexto}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Valor: {formatCurrencyToBRL(action.valPrinc)}</p>
          <p>Dias de atrazo: {action.dayLate}</p>
          {action.negotiations && action.negotiations?.length > 0 && (
            <p>{action.negotiations[0].comments}</p>
          )}
          <p>Contrato: {action.desContr}</p>
          {action.tipoContato === "TELEFONE" ? (
            <p>Contrato: {formatarFone(action.contato)}</p>
          ) : (
            <p>Contrato: {action.contato}</p>
          )}
        </CardContent>
        <CardFooter>
          <p>
            Atualizado em: {formatDateToBR(`${action.updatedAt}`)} Operarador:{" "}
            {action.user.name}{" "}
          </p>
        </CardFooter>
      </Card>
    );
  } else {
    return <p className="">Não é um acionamento válido: </p>;
  }
}
