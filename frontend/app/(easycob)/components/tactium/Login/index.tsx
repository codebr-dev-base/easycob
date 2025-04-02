"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Socket } from "socket.io-client";
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
import { da } from 'date-fns/locale';
import { ILoginTactium } from "@/app/(easycob)/interfaces/tactium";
import { getUser } from "@/app/lib/auth";
import { set } from "date-fns";

const Login = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [webhookData, setWebhookData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLogin, setDataLogin] = useState(null);

  const socket = useSocket();

  // Escuta os dados do webhook enviados pelo servidor
  useEffect(() => {
    if (socket) {
      socket.on("webhook", (data) => {
        setWebhookData(data);
      });

      socket.on("auth", (data) => {
        if (data.success) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      });
    }

    // Limpa o listener ao desmontar o componente
    return () => {
      if (socket) {
        socket.off("webhook");
      }
    };
  }, [socket]);

  useEffect(() => {
    // Verifica se o usuário está autenticado
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
      socket.emit("auth", {...data, userId});
      //setDataLogin(data);
      setIsOnline(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full relative text-blue-600 hover:text-blue-400"
        >
          <div className="absolute -top-2 -right-[52px] size-14">
            <span className="relative flex size-3">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  isOnline ? "bg-green-400" : "bg-red-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex size-3 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </span>
          </div>
          <span>Tactium</span>
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
            <Form login={login}/>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Login;
