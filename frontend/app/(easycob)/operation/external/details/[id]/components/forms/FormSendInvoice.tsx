import { IContact, ISendMail } from "@/app/(easycob)/interfaces/clients";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Value } from "@radix-ui/react-select";
import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { SubmitHandler, useForm } from "react-hook-form";
//import { sendMail } from "../../../../service/clients";
import { toast } from "@/hooks/use-toast";
import { handlerError } from "@/app/lib/error";

export default function FormSendInvoice({
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
  const [open, setOpen] = useState(false);
  const form = useForm<ISendMail>({
    mode: "all",
    defaultValues: {
      type: "copy_of_bill",
      codCredorDesRegis,
    },
  });
  const { pending: formPending } = useFormStatus();
/* 
  const onSubmit: SubmitHandler<ISendMail> = async (data) => {
    try {
      await sendMail(data);
      toast({
        title: "Sucesso",
        description: "Campanha salva!",
        variant: "success",
      });

      setOpen(false);
    } catch (error) {
      handlerError(error);
    }
  }; */

  const changeType = (value: string) => {
    form.setValue("type", value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[468px]">
        <DialogHeader>
          <DialogTitle>Enviar boleto</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className={`space-y-2 ${formPending ? "" : "hidden"}`}>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className={`space-y-2 ${formPending ? "" : "hidden"}`}>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>

{/*         <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`${!formPending ? "" : "hidden"}`}
          >

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <FormControl>
                    <>
                      <Switch
                        checked={field.value == "copy_of_bill"}
                        onCheckedChange={() => {
                          changeType("copy_of_bill");
                        }}
                      />
                      <FormLabel>Segunda via boleto</FormLabel>

                      <Switch
                        checked={field.value == "entry"}
                        onCheckedChange={() => {
                          changeType("entry");
                        }}
                      />
                      <FormLabel>Entrada do Acordo</FormLabel>
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contato
                    <FormControl>
                      <Input
                        type="email"
                        required
                        {...form.register("contact", {
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
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Arquivo
                    <FormControl>
                      <Input
                        type="file"
                        required
                        {...form.register("file", {
                          required: "Campo obrigatório",
                        })}
                        className="mb-2"
                      />
                    </FormControl>
                  </FormLabel>
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
        </Form> */}
      </DialogContent>
    </Dialog>
  );
}
