import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function AlertaDuplicate({
  open,
  setOpen,
  retry,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  retry: () => void;
}) {
  const onOpenChange = () => {
    setOpen(!open);
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alerta de acionamento duplicado!</AlertDialogTitle>
          <AlertDialogDescription>
            Por favor, revise suas entradas recentes e verifique se houve algum
            erro durante o processo de inserção. Caso necessário, corrija o
            registro duplicado para garantir a precisão e integridade dos dados.
            Deseja realmente salvar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                retry();
              }}
            >
              Continuar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
