/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IFormTemplateValues, ITemplateSms } from "../interfaces/campaign";
import { useForm, SubmitHandler } from "react-hook-form";
import { useFormStatus } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { createTemplate, updateTemplate } from "../service/templates";
import { toast } from "@/hooks/use-toast";

export function FormTemplate({
  templete,
  setTemplate,
  refreshTemplates,
}: {
  templete: ITemplateSms | null;
  setTemplate: (value: SetStateAction<ITemplateSms | null>) => void;
  refreshTemplates: () => Promise<void>;
}) {
  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    if (templete) {
      form.setValue("name", templete.name);
      form.setValue("template", templete.template);
    } else {
      form.setValue("name", "");
      form.setValue("template", "");
      form.reset();
    }
  }, [templete]);

  const form = useForm<IFormTemplateValues>({
    mode: "all",
  });

  const { pending: formPending } = useFormStatus();

  const onSubmit: SubmitHandler<IFormTemplateValues> = async (data) => {
    if (!templete) {
      try {
        setPending(true);
        await createTemplate(data);
        await refreshTemplates();
        setPending(false);
        toast({
          title: "Sucesso",
          description: "Template salvo!",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: JSON.stringify(error),
          variant: "destructive",
        });
      }
    } else {
      try {
        setPending(true);
        await updateTemplate({ id: templete.id, ...data });
        await refreshTemplates();
        setPending(false);
        toast({
          title: "Sucesso",
          description: "Template atualizado!",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: JSON.stringify(error),
          variant: "destructive",
        });
      }
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTemplate(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nome
                <FormControl>
                  <Input
                    type="text"
                    required
                    {...form.register("name", {
                      required: "Campo obrigatório",
                    })}
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
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Texto para envio de SMS"
                  className="resize-none"
                  rows={10}
                  {...field}
                  {...form.register("template", {
                    required: "Campo obrigatório",
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between p-2">
          <Button variant={"destructive"} type="button" onClick={handleClear}>
            Novo
          </Button>
          {templete && templete.id ? (
            <Button
              type="submit"
              disabled={!form.formState.isValid && !formPending}
            >
              Atualizar
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!form.formState.isValid && !formPending}
            >
              Salvar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
