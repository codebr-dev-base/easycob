import { IContract } from "@/app/(easycob)/interfaces/clients";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
export function ContainerContract({ contracts }: { contracts: IContract[] }) {
  if (contracts.length > 2) {
    return (
      <Accordion type="single" collapsible className="w-40">
        <AccordionItem value="emails">
          {/* Usar o primeiro contato como título */}
          <AccordionTrigger>
            <strong>
              {contracts[0].desContr}
            </strong>
          </AccordionTrigger>
          <AccordionContent>
            {/* Iterar sobre o restante dos contatos */}
            {contracts.slice(1).map((contract, index) => (
              <div key={index}>
                <p>
                  {contract.desContr}
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
        {contracts.length > 0
          ? `${contracts[0].desContr}` 
          : "Sem COntrato"}
      </>
    );
  }
}
