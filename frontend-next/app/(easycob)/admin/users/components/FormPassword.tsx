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
import { Switch } from "@/components/ui/switch";
import { Fragment, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { IPassword, IUser } from "@/app/interfaces/auth";
import { createUser, updatePassword, updateUser } from "../service/users";
import { Label } from "@/components/ui/label";
import { handlerError } from "@/app/lib/error";
type FormData = IPassword & IUser;
export function FormPassword({
  children,
  user,
  refresh,
}: {
  children: React.ReactNode;
  user: IUser;
  refresh: () => void;
}) {
  const form = useForm<FormData>({
    mode: "all"
  });

  const { pending: formPending } = useFormStatus();
  //const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  // Observa o campo de senha
  const password = form.watch("password");

  const onSubmit: SubmitHandler<IUser> = async (data) => {
      try {
        const c = await updatePassword({ ...user, ...data });
        toast({
          title: "Sucesso",
          description: "Senha salvo salva!",
          variant: "success",
        });
        refresh();
        setOpen(false);
      } catch (error: any) {
        handlerError(error);
      }
    
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Senha do Usuário</DialogTitle>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Senha:
                    <FormControl>
                      <Input
                        type="password"
                        required
                        {...form.register("password", {
                          required: "A senha é obrigatória",
                        })}
                        className="mb-2"
                      />
                    </FormControl>
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Senha:
                    <FormControl>
                      <Input
                        type="password"
                        required
                        {...form.register("passwordConfirmation", {
                          required: "A confirmação de senha é obrigatória",
                          validate: (value) =>
                            value === password || "As senhas não coincidem",
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
