import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ILoginTactium } from "@/app/(easycob)/interfaces/tactium";
import { Button } from "@/components/ui/button";

const Form = ({ login, dispositivo }: { login: (data: ILoginTactium) => void, dispositivo: string }) => {
  const form = useForm<ILoginTactium>({
    mode: "all",
  });

  const onSubmit = (data: ILoginTactium) => {
    login(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="dispositivo"
          rules={{ required: "Campo obrigatório" }}
          defaultValue={dispositivo}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dispositivo/Ramal</FormLabel>
              <FormControl>
                <Input placeholder="Ramal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="usuario"
          rules={{ required: "Campo obrigatório" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
              <FormControl>
                <Input placeholder="Usuário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="senha"
          rules={{ required: "Campo obrigatório" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="Senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Enviar</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default Form;
