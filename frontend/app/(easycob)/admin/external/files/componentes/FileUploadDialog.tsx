"use client"; // Adicione isso no topo do arquivo, pois o Dialog e o formulário usam hooks do React

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaSpinner } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";

interface FileUploadDialogProps {
  uploadFile: (file: File) => void;
  isLoading: boolean;
}
export function FileUploadDialog({
  uploadFile,
  isLoading,
}: FileUploadDialogProps) {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ file: FileList }>({
    mode: "all",
  });

  const onSubmit = async (data: { file: FileList }) => {
    uploadFile(data.file[0]);

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className="mx-1" variant={"secondary"} disabled={isLoading}>
          {isLoading ? (
            <FaSpinner className="h-4 w-4 animate-spin" />
          ) : (
            <FaCloudUploadAlt className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Arquivo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="file">Selecione um arquivo</Label>
            <Input
              id="file"
              type="file"
              {...register("file", {
                required: "Por favor, selecione um arquivo",
              })}
              className="mt-1"
            />
            {errors.file && (
              <p className="text-sm text-red-500 mt-1">
                {errors.file.message as string}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              Enviar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
