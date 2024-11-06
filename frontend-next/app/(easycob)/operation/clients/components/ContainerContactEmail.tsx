import { IContact } from "@/app/(easycob)/interfaces/clients";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
export function ContainerContactEmail({ contacts }: { contacts: IContact[] }) {
  if (contacts.length > 2) {
    return (
      <Accordion type="single" collapsible className="w-40">
        <AccordionItem value="emails">
          {/* Usar o primeiro contato como título */}
          <AccordionTrigger>
            <strong>
              {contacts[0].contato}{" "}
              {contacts[0].percentualAtender
                ? `(${contacts[0].percentualAtender}%)`
                : ""}
            </strong>
          </AccordionTrigger>
          <AccordionContent>
            {/* Iterar sobre o restante dos contatos */}
            {contacts.slice(1).map((contact, index) => (
              <div key={index}>
                <p>
                  {contact.contato}{" "}
                  {contact.percentualAtender
                    ? `(${contact.percentualAtender}%)`
                    : ""}
                </p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  } else {
    // Verificar se há mais de um contato ou exibir "Sem Contato"
    return (
      <>
        {contacts.length > 0
          ? `${contacts[0].contato} ${
              contacts[0].percentualAtender
                ? `(${contacts[0].percentualAtender}%)`
                : ""
            }`
          : "Sem Contato"}
      </>
    );
  }
}
