import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IContact } from "../../../../../../interfaces/clients";
import { SubmitHandler, useForm } from "react-hook-form";
import { useFormStatus } from "react-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { InputMask } from "@/components/ui/inputMask";
import { onlyNumbers } from "@/app/lib/utils";
import { Switch } from "@/components/ui/switch";
import { createContact, updateContact } from "../../../../service/contacts";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export function FormContactEmail({
  children,
  contact,
  refresh,
  codCredorDesRegis,
}: {
  children: React.ReactNode;
  contact: IContact | null;
  refresh: () => void;
  codCredorDesRegis?: string | number;
}) {
  const form = useForm<IContact>({
    mode: "all",
    defaultValues: {
      block: contact ? contact.block : false,
      blockAll: contact ? contact.blockAll : false,
    },
  });

  const { pending: formPending } = useFormStatus();
  //const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<IContact> = async (data) => {
    if (contact) {
      try {
        const c = await updateContact({ ...contact, ...data });
        toast({
          title: "Sucesso",
          description: "Contato salvo salva!",
          variant: "success",
        });
        refresh();
        setOpen(false);
      } catch (error: any) {
        handlerError(error);
      }
    } else {
      try {
        if (!codCredorDesRegis) {
          return false;
        }
        const c = await createContact({
          codCredorDesRegis,
          tipoContato: "EMAIL",
          ...data,
        });
        toast({
          title: "Sucesso",
          description: "Contato salvo salva!",
          variant: "success",
        });
        console.log(c);
        refresh();
        setOpen(false);
      } catch (error: any) {
        handlerError(error);
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar contato</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className={`space-y-2 ${formPending ? "" : "hidden"}`}>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`${!formPending ? "" : "hidden"}`}
          >
            <FormField
              control={form.control}
              name="contato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contato
                    <FormControl>
                      <Input
                        type="email"
                        required
                        {...form.register("contato", {
                          required: "Campo obrigatório",
                        })}
                        defaultValue={contact ? contact.contato : ""}
                        className="mb-2"
                      />
                    </FormControl>
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="block"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-4">
                  <FormControl>
                    <Switch
                      {...form.register("block")}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                  <div className="items-center">
                    <FormLabel className="m-0">
                      Bloqueado para este cliente
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blockAll"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-4">
                  <FormControl>
                    <Switch
                      {...form.register("blockAll")}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                  <div className="items-center">
                    <FormLabel className="m-0">Bloqueado para todos</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end py-2">
              <Button
                type="submit"
                disabled={!form.formState.isValid || formPending}
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
function handlerError(error: any) {
  throw new Error("Function not implemented.");
}
