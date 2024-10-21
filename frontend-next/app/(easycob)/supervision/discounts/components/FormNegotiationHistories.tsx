import { INegotiationOfPayment } from "@/app/(easycob)/interfaces/actions";
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
import { InputMaskCurrency } from "@/components/ui/InputMaskCurrency";
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
import { updateNegotiation } from "../service/negotiations";
import { fetchNegotiationHistories } from "../service/negotiationHistories";

import { ScrollArea } from "@/components/ui/scroll-area";
import { INegotiationHistory } from "../interfaces/discounts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaClockRotateLeft } from "react-icons/fa6";

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

export default function FormNegotiationHistories({
  open,
  onOpenChange,
  selectRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectRow: INegotiationOfPayment | null;
}) {
  const form = useForm<INegotiationOfPayment>({
    mode: "all",
  });

  const { pending: formPending } = useFormStatus();
  const [pending, setPending] = useState<boolean>(false);
  const [history, setHistory] = useState<INegotiationHistory[]>([]);

  const onSubmit: SubmitHandler<INegotiationOfPayment> = async (data) => {
    console.log(data);

    if (selectRow) {
      const payload = cleanObject(data);
      payload.id = selectRow.id;

      try {
        setPending(true);
        await updateNegotiation(payload);
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
        fetchNegotiationHistories(selectRow.id).then((data) => {
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
                    Data prevista do pagamento da entrada
                    <Input
                      type="date"
                      required
                      value={formatDateForInput(selectRow.datEntra)}
                      disabled
                      className="mb-1"
                    />
                  </FormLabel>

                  <FormLabel>
                    Valor prevista do pagamento da entrada
                    <Input
                      type="text"
                      required
                      value={formatCurrencyToBRL(selectRow.valEntra)}
                      disabled
                      className="mb-1"
                    />
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="datEntraPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Data do pagamento da entrada
                          <FormControl
                            defaultValue={
                              selectRow.datEntraPayment
                                ? formatDateForInput(selectRow.datEntraPayment)
                                : ""
                            }
                          >
                            <Input
                              type="date"
                              {...form.register("datEntraPayment")}
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
                    name="valEntraPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor da entrada
                          <FormControl>
                            <InputMaskCurrency
                              type="text"
                              {...form.register("valEntraPayment", {
                                setValueAs: (v) => {
                                  return v ? parseFromBRL(v) : "";
                                },
                              })}
                              defaultValue={`${selectRow.valEntraPayment}`}
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
