import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  IClient,
  IContact,
  IContract,
} from "@/app/(easycob)/interfaces/clients";
import { IAction, ITypeAction } from "@/app/(easycob)/interfaces/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { useFormStatus } from "react-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createAction } from "../../../../service/actions";
import { toast } from "@/hooks/use-toast";
import { handlerError } from "@/app/lib/error";
import { AlertaDuplicate } from "../AlertaDuplicate";
import { Skeleton } from "@/components/ui/skeleton";
import { calcDaylate } from "@/app/lib/utils";

const channelOptions = [
  {
    label: "Whatsapp",
    value: "whatsapp",
  },
  {
    label: "Ativo",
    value: "active",
  },
  {
    label: "Discador",
    value: "dialer",
  },
];

export default function FormSimple({
  client,
  typeAction,
  contract,
  contact,
  refresh,
}: {
  client: IClient;
  typeAction: ITypeAction | null;
  contract: IContract | null;
  contact: IContact | null;
  refresh: () => {};
}) {
  const form = useForm<IAction>({
    mode: "all",
  });

  const { pending: formPending } = useFormStatus();
  const [open, setOpen] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicate, setDuplicate] = useState<IAction | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit: SubmitHandler<IAction> = async (data) => {
    console.log(data);

    let d = {
      codCredorDesRegis: client.codCredorDesRegis,
      desRegis: client.desRegis,
      codCredor: client.codCredor,
      tipoContato: contact?.tipoContato,
      contato: contact?.contato,
      typeActionId: typeAction?.id,
      matriculaContrato: contract?.matriculaContrato,
      description: data.description,
      desContr: contract?.desContr,
      valPrinc: parseFloat(`${contract?.valPrinc}`),
      dayLate: contract?.datVenci ? calcDaylate(contract?.datVenci) : "",
      datVenci: contract?.datVenci,
      channel: data.channel,
    };

    try {
      setPending(true);
      const result = await createAction(d);
      toast({
        title: "Sucesso",
        description: "Acionamento salvo salva!",
        variant: "success",
      });
      refresh();
      setPending(false);
      setOpen(false);
    } catch (error: any) {
      if (error.data && error.data.double) {
        setDuplicate({ ...error.data });
        setIsDuplicate(true);
      } else {
        setPending(false);
        handlerError(error);
      }
    }
  };

  const retryCreateAction = async () => {
    if (!duplicate) {
      return;
    }

    try {
      setPending(true);
      const result = await createAction(duplicate);
      toast({
        title: "Sucesso",
        description: "Acionamento salvo salva!",
        variant: "success",
      });
      setDuplicate(null);
      refresh();
      setPending(false);
      setOpen(false);
    } catch (error: any) {
      if (error.data && error.data.double) {
        setDuplicate({ ...error.data });
        setIsDuplicate(true);
      } else {
        setPending(false);
        handlerError(error);
      }
    }
  };

  return (
    <>
      <AlertaDuplicate
        open={isDuplicate}
        setOpen={setIsDuplicate}
        retry={retryCreateAction}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={`${buttonVariants({ variant: "default" })} flex`}
        >
          <span className="lg:mr-2">
            <FaPlus />
          </span>
          <span className="hidden lg:block">Novo acionamento</span>
        </DialogTrigger>
        <DialogContent className="max-w-[96vw] lg:max-w-[86vw]">
          <DialogHeader>
            <DialogTitle>{client.nomClien}</DialogTitle>
            <DialogDescription>
              {typeAction?.abbreviation} - {typeAction?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[86vh] overflow-y-auto p-2">
            <div className={`space-y-2 ${pending ? "" : "hidden"}`}>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className={`${!pending ? "" : "hidden"}`}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Campo Canal */}
                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Canal
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Canal" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {channelOptions.map((c) => (
                                    <SelectItem key={c.value} value={c.value}>
                                      {c.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormLabel>
                        {!form.getValues("channel") && (
                          <FormMessage>Campo obrigatório</FormMessage>
                        )}
                        {/* Exibe a mensagem de erro */}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Campo Observações */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observações"
                          className="resize-none"
                          rows={10}
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end py-2">
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || formPending || !form.getValues("channel")}
                  >
                    Criar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
