"use client";
import Image from "next/image";
import easycob from "@/app/assets/img/easycob.svg";
import { useFormStatus, useFormState } from "react-dom";
import { signin } from "../actions";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { FormLoginValues } from "@/app/interfaces/auth";
import { error } from "console";
import { State } from "@/app/types/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function FormLogin() {
  const [state, actionSignin] = useFormState<State, FormData>(signin, null);

  const { pending } = useFormStatus();

  const form = useForm<FormLoginValues>({ mode: "all" });

  useEffect(() => {

    if (state?.status === "error") {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [form.formState.errors, state]);

  return (
    <>
      <div className="mb-4">
        <Image src={easycob} alt="alt" width={400} height={600} />
      </div>
      <Form {...form}>
        <form
          action={actionSignin}
          className="flex flex-col flex-grow justify-center m-auto p-2 w-11/12"
        >
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
                      placeholder="Digite seu email"
                      className="mb-2"
                    />
                  </FormControl>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Senha
                  <FormControl>
                    <Input
                      type="password"
                      required
                      {...form.register("password", {
                        required: "Campo obrigatório",
                      })}
                      placeholder="Digite sua senha"
                      className="mb-2"
                    />
                  </FormControl>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center">
            <Button type="submit" className="btn-primary" disabled={!form.formState.isValid && pending}>
              Entrar
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
