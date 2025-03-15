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
import { FaTrash } from "react-icons/fa";
import { deleteUser } from "../service/users";
import { IUser } from "@/app/interfaces/auth";

export function AlertDelete({
  user,
  refresh,
}: {
  user: IUser;
  refresh: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <FaTrash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            O usuário{" "}
            <span className="font-bold text-red-500">{user.name}</span> será
            excluído.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              className="bg-red-500 hover:bg-red-600"
              variant="destructive"
              onClick={() => {
                deleteUser(user);
                refresh();
              }}
            >
              <FaTrash /> Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
