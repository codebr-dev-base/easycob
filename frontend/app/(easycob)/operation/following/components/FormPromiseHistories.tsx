import { IPromiseOfPayment } from "@/app/(easycob)/interfaces/actions";
import {
  cleanObject,
  formatDateForInput,
  formatDateToBR,
  formatCurrencyToBRL,
  parseFromBRL,
} from "@/app/lib/utils";
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
import { InputCurrency } from "@/components/ui/inputCurrency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaClockRotateLeft } from "react-icons/fa6";
import { updatePromise } from "../service/promises";
import { fetchPromiseHistories } from "../service/promiseHistories";
import { IPromeseHistory } from "../interfaces/following";

const options = [
  {
    label: "Pago",
    value: "paid",
  },
  {
    label: "Não Pago",
    value: "null",
  },
  {
    label: "Quebra",
    value: "breach",
  },
];

export default function FormPromiseHistories({
  open,
  onOpenChange,
  selectRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectRow: IPromiseOfPayment | null;
}) {
  const form = useForm<IPromiseOfPayment>({
    mode: "all",
  });

  const { pending: formPending } = useFormStatus();
  const [pending, setPending] = useState<boolean>(false);
  const [history, setHistory] = useState<IPromeseHistory[]>([]);

  const onSubmit: SubmitHandler<IPromiseOfPayment> = async (data) => {
    console.log(data);

    if (selectRow) {
      const payload = cleanObject(data);
      payload.id = selectRow.id;

      try {
        setPending(true);
        await updatePromise(payload);
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

  useEffect(() => {
    if (selectRow && selectRow.id) {
      const refreshHistory = async () => {
        setPending(true);
        fetchPromiseHistories(selectRow.id).then((data) => {
          setHistory(data);
        });

        setPending(false);
      };

      refreshHistory();
    }
  }, [selectRow]);
  return (
    <>
      {!!selectRow && (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent>
            <ScrollArea className="h-[96vh] w-full pr-4">
              <SheetHeader>
                <SheetTitle>{selectRow.client}</SheetTitle>
                <SheetDescription>{selectRow.desContr}</SheetDescription>
              </SheetHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
                  <FormLabel>
                    Data prevista do pagamento
                    <Input
                      type="date"
                      required
                      value={formatDateForInput(selectRow.datPrev)}
                      disabled
                      className="mb-1"
                    />
                  </FormLabel>

                  <FormLabel>
                    Valor prevista do pagamento
                    <Input
                      type="text"
                      required
                      value={formatCurrencyToBRL(selectRow.valPrest)}
                      disabled
                      className="mb-1"
                    />
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="datPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Data do pagamento
                          <FormControl
                            defaultValue={
                              selectRow.datPayment
                                ? formatDateForInput(selectRow.datPayment)
                                : ""
                            }
                          >
                            <Input
                              type="date"
                              {...form.register("datPayment")}
                              className="mb-1"
                            />
                          </FormControl>
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor
                          <FormControl>
                            <InputCurrency
                              type="text"
                              currency="BRL"
                              locale="pt-BR"
                              {...form.register("valPayment", {
                                setValueAs: (v) => {
                                  return v ? parseFromBRL(v) : "";
                                },
                              })}
                              defaultValue={`${selectRow.valPayment}`}
                              className="mb-1"
                            />
                          </FormControl>
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="followingStatus"
                    defaultValue={
                      selectRow.followingStatus
                        ? selectRow.followingStatus
                        : "null"
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Template
                          <div className="flex">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um Template" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                {options.map((option, index) => (
                                  <SelectItem key={index} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre o contato com cliente"
                            className="resize-none"
                            {...field}
                            {...form.register("comments", {
                              required: "Campo obrigatório",
                            })}
                          />
                        </FormControl>
                        <FormDescription>
                          Observações sobre o contato com cliente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end my-2">
                    <Button
                      type="submit"
                      disabled={!form.formState.isValid && !formPending}
                    >
                      Criar
                    </Button>
                  </div>
                </form>
              </Form>

              {history.map((item, index) => {
                return (
                  <Alert key={index}>
                    <FaClockRotateLeft className="h-4 w-4" />
                    <AlertTitle> {formatDateToBR(item.createdAt)}</AlertTitle>
                    <AlertDescription>{item.comments}</AlertDescription>
                  </Alert>
                );
              })}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
