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
import { Fragment, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { IPassword, ISkill, ISkillModule, IUser } from "@/app/interfaces/auth";
import { createUser, updateUser } from "../service/users";
import { Label } from "@/components/ui/label";
import { handlerError } from "@/app/lib/error";
type FormData = IPassword & IUser;
export function FormUser({
  children,
  user,
  refresh,
  modules,
}: {
  children: React.ReactNode;
  user: IUser | null;
  refresh: () => void;
  modules: ISkillModule[];
}) {
  const form = useForm<FormData>({
    mode: "all",
    defaultValues: {
      isActived: (user && user.isActived) || !user ? true : false,
    },
  });

  const { pending: formPending } = useFormStatus();
  //const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<number[]>([]);

  // Observa o campo de senha
  const password = form.watch("password");

  const onSubmit: SubmitHandler<IUser> = async (data) => {
    if (user) {
      try {
        const c = await updateUser({ ...user, ...data, skills });
        toast({
          title: "Sucesso",
          description: "Usuário salvo salva!",
          variant: "success",
        });
        refresh();
        setOpen(false);
      } catch (error: any) {
        handlerError(error);
      }
    } else {
      try {
        const c = await createUser({ ...data, skills });
        toast({
          title: "Sucesso",
          description: "Usuário salvo salva!",
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

  const toggleIdInSkill = (num: number) => {
    // Verifica se o número está no array
    const index = skills.indexOf(num);

    if (index > -1) {
      // Remove o número se ele já estiver no array
      skills.splice(index, 1);
    } else {
      // Adiciona o número se ele não estiver no array
      skills.push(num);
    }

    setSkills([...skills]);
  };

  useEffect(() => {
    if (user) {
      const ids: number[] = [];
      user.skills.map((skill) => {
        if (typeof skill === "object" && skill !== null) {
          ids.push(skill.id); // Se skill for um objeto, pega o id
        } else if (typeof skill === "number") {
          ids.push(skill); // Se skill for um número, usa o valor diretamente
        }
      });
      setSkills(ids);
    }
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome:
                    <FormControl>
                      <Input
                        type="text"
                        required
                        {...form.register("name", {
                          required: "Campo obrigatório",
                        })}
                        defaultValue={user ? user.name : ""}
                        className="mb-2"
                      />
                    </FormControl>
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email
                    <FormControl>
                      <Input
                        type="email"
                        required
                        {...form.register("email", {
                          required: "Campo obrigatório",
                        })}
                        defaultValue={user ? user.email : ""}
                        className="mb-2"
                      />
                    </FormControl>
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CPF:
                    <FormControl>
                      <InputMask
                        mask="999.999.999-99"
                        type="text"
                        required
                        {...form.register("cpf", {
                          required: "Campo obrigatório",
                        })}
                        defaultValue={user ? user.cpf : ""}
                        className="mb-2"
                      />
                    </FormControl>
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Telefone:
                    <FormControl>
                      <InputMask
                        mask="(99) 9 9999-9999"
                        type="text"
                        required
                        {...form.register("phone", {
                          required: "Campo obrigatório",
                        })}
                        defaultValue={user ? user.phone : ""}
                        className="mb-2"
                      />
                    </FormControl>
                  </FormLabel>
                </FormItem>
              )}
            />

            {!user && (
              <>
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
              </>
            )}

            <FormField
              control={form.control}
              name="isActived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-4">
                  <FormControl>
                    <Switch
                      {...form.register("isActived")}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                  <div className="items-center">
                    <FormLabel className="m-0">Ativo</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex">
              {modules.map((module) => (
                <div key={module.id}>
                  {module.skills.map((skill) => (
                    <Label
                      key={skill.id}
                      className="flex flex-row items-center space-x-2 space-y-0 p-4"
                    >
                      <Switch
                        defaultChecked={skills.includes(skill.id)}
                        onCheckedChange={() => {
                          toggleIdInSkill(skill.id);
                        }}
                      />
                      <span>{module.name}</span>
                    </Label>
                  ))}
                </div>
              ))}
            </div>

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

