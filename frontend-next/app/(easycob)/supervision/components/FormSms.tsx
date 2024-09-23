/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputMask } from "@/components/ui/inputMask";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  IFormCampaignValues,
  IQueryCampaignParams,
  ITemplateSms,
} from "../interfaces/campaign";
import { useForm, SubmitHandler } from "react-hook-form";
import { useFormStatus } from "react-dom";
import { onlyNumbers } from "@/app/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { createCampaign, query } from "../service/campaigns";
import { toast } from "@/hooks/use-toast";
import { handlerError } from "@/app/lib/error";

export function FormSms({
  templates,
  setShowTemplateForm,
  setTemplate,
  showTemplateForm,
  pending,
  setOpen,
  queryCampaign,
  refreshCampaign,
}: {
  templates: ITemplateSms[];
  setShowTemplateForm: (value: SetStateAction<boolean>) => void;
  setTemplate: (value: SetStateAction<ITemplateSms | null>) => void;
  showTemplateForm: boolean;
  pending: boolean;
  setOpen: (value: boolean) => void;
  queryCampaign: IQueryCampaignParams;
  refreshCampaign: () => void;
}) {
  let form = useForm<IFormCampaignValues>({
    mode: "all",
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      /* message: templates[0] ? templates[0].template : "", */
    },
  });

  const { pending: formPending } = useFormStatus();

  const onSubmit: SubmitHandler<IFormCampaignValues> = async (data) => {
    try {
      await createCampaign({ ...data, singleSend: true });
      toast({
        title: "Sucesso",
        description: "Campanha salva!",
        variant: "success",
      });
      queryCampaign.page = 1;
      refreshCampaign();
      setOpen(false);
    } catch (error) {
      handlerError(error);
    }
  };

  const handlerShowSelectTemplate = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const filteredTemplates = templates.filter(
      (item) => item.template === form.getValues("message")
    );

    if (filteredTemplates.length > 0) {
      setTemplate(filteredTemplates[0]);
      setShowTemplateForm(!showTemplateForm);
    } else {
      setTemplate(null);
    }
  };

  const getSelect = () => {
    const filteredTemplates = templates.filter(
      (item) => item.template === form.getValues("message")
    );

    if (filteredTemplates[0]) {
      return filteredTemplates[0];
    }
    return templates[0];
  };

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === "message") {
        setTemplate(getSelect());
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (templates.length > 0) {
      form.setValue("message", templates[0].template); // Atualiza o valor selecionado
    }
  }, [templates]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Data
                <FormControl>
                  <Input
                    type="date"
                    required
                    {...form.register("date", {
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
          name="numWhatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                WhatsApp
                <FormControl>
                  <InputMask
                    mask="(99) 9 9999-9999"
                    type="text"
                    required
                    {...form.register("numWhatsapp", {
                      required: "Campo obrigatório",
                      setValueAs: (v) => onlyNumbers(v),
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          defaultValue={templates[0].template}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Template
                <div className="flex">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl defaultValue={templates[0].template}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Selecione um Template"
                          defaultValue={templates[0].template}
                        >
                          {getSelect().name}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent defaultValue={templates[0].template}>
                      {templates.map((message, index) => (
                        <SelectItem key={index} value={message.template}>
                          {message.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="ml-1" onClick={handlerShowSelectTemplate}>
                    {!showTemplateForm ? <FaRegEye /> : <FaRegEyeSlash />}
                  </Button>
                </div>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!form.formState.isValid && !formPending}
          >
            Criar
          </Button>
        </div>
      </form>
    </Form>
  );
}
