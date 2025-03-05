import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { IContact } from "../../../../interfaces/contracts";

export function FormContactPhone({
  children,
  contact,
  desContr,
  createContact,
  updateContact,
}: {
  children: React.ReactNode;
  contact: IContact | null;
  desContr: string | number;
  createContact: (data: IContact) => Promise<void>;
  updateContact: (data: IContact) => Promise<void>;
}) {
  const form = useForm<IContact>({
    mode: "all",
    defaultValues: {
      cpc: contact ? contact.cpc : false,
      isWhatsapp: contact ? contact.isWhatsapp : false,
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
        setOpen(false);
      } catch (error: any) {
        handlerError(error);
      }
    } else {
      try {
        if (!desContr) {
          return false;
        }
        const c = await createContact({
          desContr,
          tipoContato: "TELEFONE",
          ...data,
        });
        toast({
          title: "Sucesso",
          description: "Contato salvo salva!",
          variant: "success",
        });
        console.log(c);
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
                      <InputMask
                        mask="(99) 9 9999-9999"
                        type="text"
                        required
                        {...form.register("contato", {
                          required: "Campo obrigatório",
                          setValueAs: (v) => onlyNumbers(v),
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
              name="cpc"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-4">
                  <FormControl>
                    <Switch
                      {...form.register("cpc")}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                  <div className="items-center">
                    <FormLabel className="m-0">CPC</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isWhatsapp"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-4">
                  <FormControl>
                    <Switch
                      {...form.register("isWhatsapp")}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                  <div className="items-center">
                    <FormLabel className="m-0">Whatsapp</FormLabel>
                  </div>
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
