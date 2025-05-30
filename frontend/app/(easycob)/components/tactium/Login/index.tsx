"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Form from "./Form";
import { ILoginTactium } from "@/app/(easycob)/interfaces/tactium";
import { getUser } from "@/app/lib/auth";
import { Socket } from "socket.io-client";
import { is } from "date-fns/locale";

const Login = ({
  children,
  socket,
  dispositivo,
  setDispositivo,
  isLoading,
  setIsLoading,
}: {
  children: React.ReactNode;
  socket: Socket;
  dispositivo: string;
  setDispositivo: (string) => void;
  isLoading: boolean;
  setIsLoading: (boolean) => void;
}) => {
  const [open, setOpen] = useState(false);

  const login = async (data: ILoginTactium) => {
    if (!socket) {
      console.error("Socket não está disponível.");
      return;
    }

    if (!data.dispositivo || data.dispositivo === "") {
      console.error("Dispositivo não encontrado.");
      return;
    }

    setDispositivo(data.dispositivo);

    console.log("Dispositivo Data:", data.dispositivo);
    console.log("Dispositivo:", dispositivo);

    const userId = getUser()?.id;
    if (!userId) {
      console.error("ID do usuário não encontrado.");
      return;
    }
    setIsLoading(true);
    try {
      socket.emit("login", { ...data, userId });
      console.log(`dispositivo pos envio: ${data.dispositivo}`);
      //setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Em teste! não usar</DialogTitle>
          <DialogDescription>Login de integração CRM Tactium</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div>
            <Form login={login} dispositivo={dispositivo} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Login;
