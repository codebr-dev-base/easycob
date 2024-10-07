/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState } from "react";
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
} from "../interfaces/campaign";
import { useForm, SubmitHandler } from "react-hook-form";
import { useFormStatus } from "react-dom";
import { onlyNumbers } from "@/app/lib/utils";
import { createCampaign, query } from "../service/campaigns";
import { toast } from "@/hooks/use-toast";
import { handlerError } from "@/app/lib/error";

export function FormEmail({
  setOpen,
  queryCampaign,
  refreshCampaign,
}: {
  pending: boolean;
  setOpen: (value: boolean) => void;
  queryCampaign: IQueryCampaignParams;
  refreshCampaign: () => void;
}) {
  let form = useForm<IFormCampaignValues>({
    mode: "all",
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  const { pending: formPending } = useFormStatus();
  const [numWhatsapp, setNumWhatsapp] = useState("");

  const onSubmit: SubmitHandler<IFormCampaignValues> = async (data) => {
    try {
      await createCampaign({ ...data, singleSend: true, type: "EMAIL" });
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      const whatsappNumber = fileNameWithoutExtension.split("-").pop(); // Extrai a última parte do nome do arquivo

      form.setValue("name", fileNameWithoutExtension);
      form.setValue("numWhatsapp", `${whatsappNumber}`);
      setNumWhatsapp(`${whatsappNumber}`);    }
  };

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
                      onChange: handleFileChange,
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
                    autoValue={numWhatsapp}
                    className="mb-2"
                  />
                </FormControl>
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
