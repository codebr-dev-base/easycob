import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import { ITag } from "../interfaces/tag";
import { SubmitHandler, useForm, Form } from "react-hook-form";
import { handlerError } from "@/app/lib/error";
import { error } from "console";
import { toast } from "@/hooks/use-toast";
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { reverse } from "dns";

export default function FormTag({
  children,
  tag,
  createTag,
  updateTag,
  isLoading,
  error,
}: {
  children?: React.ReactNode;
  tag?: ITag;
  createTag?: (tag: ITag) => Promise<void>;
  updateTag?: (tagId: number, updatedTag: Partial<ITag>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<ITag>({
    mode: "all",
    defaultValues: tag && {
      id: tag.id,
      name: tag.name,
      validity: tag.validity,
      color: tag.color,
    },
  });

  const onSubmit: SubmitHandler<ITag> = async (data: ITag) => {
    try {
      if (tag && updateTag) {
        await updateTag(tag.id, data);
      } else if (createTag) {
        const newTag = await createTag(data);
      }
      form.reset();
      setOpen(false);
    } catch (error) {
      handlerError(error);
    }
  };
  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className="mx-1" variant={"secondary"}>
            Novo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Editar Tag</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Campo obrigatório" }}
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome:
                        <FormControl>
                          <Input {...field} className="mb-2" />
                        </FormControl>
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validity"
                  rules={{ required: "Campo obrigatório" }}
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Validade:
                        <FormControl>
                          <Input {...field} className="mb-2" />
                        </FormControl>
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  rules={{ required: "Campo obrigatório" }}
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cor:
                        <FormControl>
                          <Input
                            {...field}
                            className="mb-2 ml-2 w-7 h-7"
                            style={{ padding: "revert" }}
                            type="color"
                          />
                        </FormControl>
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end py-2">
                  <Button type="submit" disabled={isLoading}>Salvar</Button>
                </div>
              </form>
            </FormProvider>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
