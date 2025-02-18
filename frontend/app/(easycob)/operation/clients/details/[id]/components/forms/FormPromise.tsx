import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  IClient,
  IContact,
  IContract,
} from "@/app/(easycob)/interfaces/clients";
import { IAction, ITypeAction } from "@/app/(easycob)/interfaces/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { useFormStatus } from "react-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { InputCurrency } from "@/components/ui/inputCurrency";
import { calcDaylate, parseFromBRL } from "@/app/lib/utils";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { createAction } from "../../../../service/actions";
import { toast } from "@/hooks/use-toast";
import { handlerError } from "@/app/lib/error";
import { AlertaDuplicate } from "../AlertaDuplicate";
import { Skeleton } from "@/components/ui/skeleton";

const channelOptions = [
  {
    label: "WhatsApp",
    value: "whatsapp",
  },
  {
    label: "Ativo",
    value: "active",
  },
  {
    label: "Discador",
    value: "dialer",
  },
];

export default function FormPromise({
  client,
  typeAction,
  contract,
  contact,
  refresh,
}: {
  client: IClient;
  typeAction: ITypeAction | null;
  contract: IContract | null;
  contact: IContact | null;
  refresh: () => {};
}) {
  const form = useForm<IAction>({
    mode: "all",
  });

  const { pending: formPending } = useFormStatus();
  const [open, setOpen] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicate, setDuplicate] = useState<IAction | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit: SubmitHandler<IAction> = async (data) => {
    console.log(data);

    let d = {
      codCredorDesRegis: client.codCredorDesRegis,
      desRegis: client.desRegis,
      codCredor: client.codCredor,
      tipoContato: contact?.tipoContato,
      contato: contact?.contato,
      typeActionId: typeAction?.id,
      matriculaContrato: contract?.matriculaContrato,
      description: data.description,
      desContr: contract?.desContr,
      dayLate: contract?.datVenci ? calcDaylate(contract?.datVenci) : "",
      valPrinc: parseFloat(`${contract?.valPrinc}`),
      datVenci: contract?.datVenci,
      channel: data.channel,
      wallet: client.isFixa ? 'F' : 'V'
    };

    let p;

    if (data.promise?.discount) {
      p = {
        ...d,
        promise: {
          valOriginal: parseFloat(`${contract?.valPrinc}`),
          datPrev: data.promise?.datPrev,
          valPrest: data.promise?.valPrest,
          discount: data.promise?.discount,
          valDiscount: data.promise?.valDiscount,
          percDiscount: data.promise?.percDiscount,
        },
      };
    } else {
      p = {
        ...d,
        promise: {
          valOriginal: parseFloat(`${contract?.valPrinc}`),
          datPrev: data.promise?.datPrev,
          valPrest: data.promise?.valPrest,
        },
      };
    }

    try {
      setPending(true);
      const result = await createAction(p);
      toast({
        title: "Sucesso",
        description: "Acionamento salvo salva!",
        variant: "success",
      });
      refresh();
      setPending(false);
      setOpen(false);
    } catch (error: any) {
      if (error.data && error.data.double) {
        setDuplicate({ ...error.data });
        setIsDuplicate(true);
      } else {
        setPending(false);
        handlerError(error);
      }
    }
  };

  const discount = form.watch("promise.discount");

  const retryCreateAction = async () => {
    if (!duplicate) {
      return;
    }

    try {
      const result = await createAction(duplicate);
      toast({
        title: "Sucesso",
        description: "Acionamento salvo salva!",
        variant: "success",
      });
      setDuplicate(null);
      refresh();
      setPending(false);
      setOpen(false);
    } catch (error: any) {
      if (error.data && error.data.double) {
        setDuplicate({ ...error.data });
        setIsDuplicate(true);
      } else {
        setPending(false);
        handlerError(error);
      }
    }
  };

  return (
    <>
      <AlertaDuplicate
        open={isDuplicate}
        setOpen={setIsDuplicate}
        retry={retryCreateAction}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={`${buttonVariants({ variant: "default" })} flex`}
        >
          <span className="lg:mr-2">
            <FaPlus />
          </span>
          <span className="hidden lg:block">Novo acionamento</span>
        </DialogTrigger>
        <DialogContent className="max-w-[96vw] lg:max-w-[86vw]">
          <DialogHeader>
            <DialogTitle>{client.nomClien}</DialogTitle>
            <DialogDescription>
              {typeAction?.abbreviation} - {typeAction?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[86vh] overflow-y-auto p-2">
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Campo Canal */}
                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Canal
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Canal" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {channelOptions.map((c) => (
                                    <SelectItem key={c.value} value={c.value}>
                                      {c.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormLabel>
                        {!form.getValues("channel") && (
                          <FormMessage>Campo obrigatório</FormMessage>
                        )}
                        {/* Exibe a mensagem de erro */}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="promise.discount"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="items-center">
                          <FormLabel className="m-0">
                            Negociação com desconto?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="promise.valDiscount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor do desconto
                          <FormControl>
                            <InputCurrency
                              type="text"
                              currency="BRL"
                              locale="pt-BR"
                              {...form.register("promise.valDiscount", {
                                disabled: !discount,
                                setValueAs: (v) => {
                                  return v ? parseFromBRL(v) : "";
                                },
                              })}
                              onChange={(e) => field.onChange(e.target.value)} // Usa o valor bruto (sem formatação) no formulário
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
                    name="promise.percDiscount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor do desconto %
                          <FormControl>
                            <Input
                              type="number"
                              defaultValue={1}
                              {...form.register("promise.percDiscount", {
                                disabled: !discount,
                                setValueAs: (v) => {
                                  return v ? parseFromBRL(v) : "";
                                },
                              })}
                              className="mb-1"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Campo valor original */}
                  <FormField
                    control={form.control}
                    name="promise.valOriginal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor Original
                          <FormControl>
                            <InputCurrency
                              type="text"
                              currency="BRL"
                              locale="pt-BR"
                              {...form.register("promise.valOriginal", {
                                setValueAs: (v) => {
                                  return v ? parseFromBRL(v) : "";
                                },
                                disabled: true,
                              })}
                              defaultValue={contract?.valPrinc || 0}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="mb-1"
                            />
                          </FormControl>
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="promise.datPrev"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Data prevista
                          <FormControl>
                            <Input
                              type="date"
                              {...form.register("promise.datPrev", {
                                required: "Campo obrigatório",
                              })}
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
                    name="promise.valPrest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor Negociado
                          <FormControl>
                            <InputCurrency
                              type="text"
                              currency="BRL"
                              locale="pt-BR"
                              {...form.register("promise.valPrest", {
                                setValueAs: (v) => {
                                  return v ? parseFromBRL(v) : "";
                                },
                              })}
                              onChange={(e) => field.onChange(e.target.value)} // Usa o valor bruto (sem formatação) no formulário
                              className="mb-1"
                            />
                          </FormControl>
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Campo Observações */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observações"
                          className="resize-none"
                          rows={10}
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end py-2">
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || formPending || !form.getValues("channel")}
                  >
                    Criar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
