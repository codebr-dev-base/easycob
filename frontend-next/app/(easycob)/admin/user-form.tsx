"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";

type UserFormProps = {
  initialValue: Partial<z.infer<typeof userSchema>>;
};

// WARN: Dummy Data. Remove when integrating to the backend
const accessLevels = [
  {
    id: 4,
    module: "admin",
    label: "Acesso total",
  },
  {
    id: 2,
    module: "admin",
    label: "Inserir Dados",
  },
  {
    id: 1,
    module: "admin",
    label: "Listar dados",
  },
  {
    id: 3,
    module: "admin",
    label: "Atualizar dados",
  },
  {
    id: 5,
    module: "supervisor",
    label: "Acesso total",
  },
  {
    id: 6,
    module: "supervisor",
    label: "Inserir Dados",
  },
  {
    id: 7,
    module: "supervisor",
    label: "Listar dados",
  },
  {
    id: 8,
    module: "supervisor",
    label: "Atualizar dados",
  },
  {
    id: 9,
    module: "operator",
    label: "Acesso total",
  },
  {
    id: 10,
    module: "operator",
    label: "Inserir Dados",
  },
  {
    id: 11,
    module: "operator",
    label: "Listar dados",
  },
  {
    id: 12,
    module: "operator",
    label: "Atualizar dados",
  },
];

const modules = [
  {
    module: "admin",
    label: "Módulo Administração",
  },
  {
    module: "supervisor",
    label: "Módulo Supervisor",
  },
  {
    module: "operator",
    label: "Módulo Operador",
  },
];

const userSchema = z
  .object({
    action: z.enum(["edit", "create"]),
    email: z.string().email("Email inválido"),
    name: z.string().min(3, "Nome deve ter mais de 2 caracteres"),
    cpf: z.string().min(11, "CPF inválido"),
    phone: z.string().min(11, "Telefone inválido"),
    password: z.string().min(8, "Senha deve possuir 8 ou mais caracteres"),
    passwordConfirmation: z.string(),
    isActive: z.boolean().default(true),
    skills: z.array(z.number().int()).default([]),
  })
  .refine((state) => state.passwordConfirmation === state.password, {
    message: "Senhas não conferem",
    path: ["passwordConfirmation"],
  });

// TODO: Submit function
export function UserForm(props: UserFormProps) {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: props.initialValue,
  });

  useEffect(() => {
    console.log(form.getValues("skills"));
  }, [form.watch("skills")]);
  return (
    <>
      <DialogHeader className="bg-primary">
        <DialogTitle className="text-white text-2xl py-2 px-4 leading-10">
          {props.initialValue.action === "create"
            ? "Novo usuário"
            : "Editar usuário"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((d) => console.table(d))}
          className="px-4 text-sm pb-4"
        >
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-medium">Dados do usuário</h4>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>E-mail de acesso</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@yuancob.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Nome de usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(86) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Confirmação de senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="checkbox"
                          className="w-4"
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                          }}
                        />
                        <FormLabel className="font-normal mb-0 text-black">
                          Usuário está ativo
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <h4 className="text-black font-medium">Permissões</h4>
              <PermissionsForm
                form={form}
                accessLevels={accessLevels}
                modules={modules}
              />
            </div>
          </div>
          <div className="sm:flex gap-4 mt-4">
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" type="reset" onClick={() => form.reset()}>
              Limpar
            </Button>
            <DialogClose asChild className="ml-auto">
              <Button variant="ghost" type="reset">
                Cancelar
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </>
  );
}

type PermissionsFormProps = {
  form: UseFormReturn<z.infer<typeof userSchema>>;
  modules: { module: string; label: string }[];
  accessLevels: { id: number; module: string; label: string }[];
};

function PermissionsForm({
  form,
  modules,
  accessLevels,
}: PermissionsFormProps) {
  return (
    <FormField
      name="skills"
      control={form.control}
      render={({ field }) => {
        return (
          <div>
            {modules.map((module) => (
              <>
                <h4 className="text-black font-medium">{module.label}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {accessLevels
                    .filter((l) => l.module === module.module)
                    .map((l) => {
                      return (
                        <FormItem key={l.id + "_" + l.module}>
                          <FormControl>
                            <div className="flex gap-1">
                              <Input
                                type="checkbox"
                                className="w-4"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    form.setValue("skills", [
                                      ...field.value,
                                      l.id,
                                    ]);
                                  } else {
                                    form.setValue(
                                      "skills",
                                      field.value.filter((it) => l.id !== it),
                                    );
                                  }
                                }}
                              />
                              <Label className="text-black font-normal mb-0">
                                {l.label}
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    })}
                </div>
              </>
            ))}
          </div>
        );
      }}
    />
  );
}
