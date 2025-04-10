"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/app/hooks/useSocket";
import { toast } from "@/hooks/use-toast";
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
import { da } from "date-fns/locale";
import { ILoginTactium } from "@/app/(easycob)/interfaces/tactium";
import { getUser } from "@/app/lib/auth";
import { set } from "date-fns";
import { log } from "console";
import useStateTactium from "../hooks/useStateTactium";

const Login = () => {
  const [isOnline, setIsOnline] = useStateTactium("isOnlineTactium", false);
  const [dispositivo, setDispositivo] = useStateTactium(
    "dispositivoTactium",
    ""
  );
  const [webhookData, setWebhookData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLogin, setDataLogin] = useState<{
    dispositivo: string;
    usuario: string;
    senha: string;
    userId: number | string | null;
  } | null>(null);

  const socket = useSocket();

  // Escuta os dados do webhook enviados pelo servidor
  useEffect(() => {
    if (socket) {
      socket.on("auth", (data) => {
        if (data.auth) {
          toast({
            title: "Sucesso",
            description: "Você está Online!",
            variant: "success",
          });
          setIsOnline(true);
        } else {
          toast({
            title: "Erro",
            description: "Você está Offline!",
            variant: "destructive",
          });
          setIsOnline(false);
        }
        setIsLoading(false);
        setOpen(false);
      });

      if (isOnline && dispositivo !== "") {
        socket.emit("refresh", { "dispositivo": dispositivo });
      }

    }

    // Limpa o listener ao desmontar o componente
    return () => {
      if (socket) {
        socket.off("auth");
      }
    };
  }, [socket]);

  useEffect(() => {
    // Alerta com dados vindo do servidor
    toast({
      title: "Alerta",
      description: JSON.stringify(webhookData, null, 2),
      variant: "default",
    });
  }, [webhookData]);

  const login = async (data: ILoginTactium) => {
    if (!socket) {
      console.error("Socket não está disponível.");
      return;
    }
    const userId = getUser()?.id;
    if (!userId) {
      console.error("ID do usuário não encontrado.");
      return;
    }
    setIsLoading(true);
    try {
      socket.emit("auth", { ...data, userId });
      //setDataLogin({ ...data, userId });
      setDispositivo(data.dispositivo);
      //setIsOnline(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full relative text-blue-600 hover:text-blue-400"
        >
          <span>{isOnline ? "Online" : "Offline"}</span>
        </Button>
      </DialogTrigger>
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
            <Form login={login} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Login;
