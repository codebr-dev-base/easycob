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
import { ITypeAction } from "@/app/(easycob)/interfaces/actions";
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
import { toast } from "@/hooks/use-toast";
import { handlerError } from "@/app/lib/error";
import { Skeleton } from "@/components/ui/skeleton";
import { calcDaylate } from "@/app/lib/utils";
import { Wallet } from "lucide-react";
import { IAction } from "../../../../interfaces/actions";
import { AlertaDuplicate } from "../AlertaDuplicate";
import { IContact, IContract } from "../../../../interfaces/contracts";

const channelOptions = [
  {
    label: "WhatsApp",
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
  typeAction,
  contract,
  contact,
  createAction,
  isLoading,
}: {
  typeAction: ITypeAction | null;
  contract: IContract;
  contact: IContact | null;
  createAction: (data: IAction) => Promise<void>;
  isLoading: boolean;
}) {
  const form = useForm<IAction>({
    mode: "all",
  });

  const { pending: formPending } = useFormStatus();
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<IAction> = async (data) => {
    const payload = {
      desContr: contract?.desContr,
      tipoContato: contact?.tipoContato,
      contato: contact?.contato,
      typeActionId: typeAction?.id,
      description: data.description,
      channel: data.channel,
    };

    await createAction(payload);

    toast({
      title: "Sucesso",
      description: "Acionamento salvo com sucesso!",
      variant: "success",
    });

    setOpen(false);
  };

  return (
    <>
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
            <DialogTitle>{contract?.nomCliente}</DialogTitle>
            <DialogDescription>
              {typeAction?.abbreviation} - {typeAction?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[86vh] overflow-y-auto p-2">
            <div className={`space-y-2 ${isLoading ? "" : "hidden"}`}>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={`${!isLoading ? "" : "hidden"}`}
              >
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
                    disabled={
                      !form.formState.isValid ||
                      formPending ||
                      !form.getValues("channel")
                    }
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
