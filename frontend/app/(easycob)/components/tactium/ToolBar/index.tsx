"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CgMenuGridO } from "react-icons/cg";
import { MdLogin, MdLogout } from "react-icons/md";
import useStateTactium from "../hooks/useStateTactium";
import Login from "../Login";
import { useSocket } from "@/app/hooks/useSocket";
import Logout from "../Logout";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import Pausa from "../Pause";
import Pause from "../Pause";
import { set } from "date-fns";
import { se } from "date-fns/locale";

export default function ToolBar() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [pulsarActive, setPulsarActive] = useState(false);
  const [isOnline, setIsOnline] = useStateTactium("isOnlineTactium", false);
  const [dispositivo, setDispositivo] = useStateTactium(
    "dispositivoTactium",
    "",
    12000
  );
  const [isPause, setIsPause] = useStateTactium("isPauseTactium", false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { socket, isConnected } = useSocket();

  // Escuta os dados do webhook enviados pelo servidor
  useEffect(() => {
    if (socket) {
    }

    // Limpa o listener ao desmontar o componente
    return () => {
      if (socket) {
        socket.off("auth");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("auth", (data) => {
        console.log("Dados recebidos do servidor:", data);
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
        setIsPause(false);
        setIsLoading(false);
      });

      socket.on("pause", (data) => {
        if (data.pause) {
          toast({
            title: "Pausa",
            description: "Você está Pausa!",
            variant: "destructive",
          });
          //setIsOnline(true);
          setIsPause(true);
        } else {
          toast({
            title: "Ativo",
            description: "Fim da pausa!",
            variant: "success",
          });
          setIsPause(false);
        }
      });

      if (isOnline) {
        socket.emit("refresh", { dispositivo: dispositivo });
      }
      socket.on("refresh", (data) => {
        console.log("Dados recebidos do servidor:", data);
        if (!data.auth) {
          setIsOnline(false);
          setIsPause(false);
          setDispositivo("");
        }
      });

      socket.onAny((event, ...args) => {
        console.log(`Evento recebido: ${event}`, args);
      });

      socket.on("answered", (data) => {
        console.log("Ligação atendida:", data);
        router.push(`/operation/clients/details/${data.codCredorDesRegis}`);
      });
      socket.on("ringing", (data) => {
        toast({
          title: "Ligação Atendida",
          description: `Ligação atendida por ${data}`,
          variant: "default",
        });
      });
    }
    return () => {
      if (socket) {
      }
    };
  }, [socket]);

  const changePulsar = () => {
    setPulsarActive(!pulsarActive);
  };

  return (
    isConnected && (
      <div className="flex justify-center items-center">
        <Button
          variant="outline"
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-10 w-10 p-0 text-gray-800 hover:text-gray-950"
        >
          <CgMenuGridO className="h-6 w-6" />
        </Button>
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 transition-opacity duration-1000 rounded-lg ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {socket && (
            <ul className="p-2 flex row justify-center bg-white rounded-md shadow-lg space-x-4">
              {!isOnline ? (
                <>
                  <li className="py-2">
                    <Login
                      socket={socket}
                      dispositivo={dispositivo}
                      setDispositivo={setDispositivo}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    >
                      <Button
                        variant="outline"
                        className={`h-10 w-10 p-0 bg-green-500 ${
                          isLoading ? "animate-pulse" : ""
                        }`}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <FaSpinner className="h-6 w-6 animate-spin" />
                        ) : (
                          <MdLogin className="h-6 w-6" />
                        )}
                      </Button>
                    </Login>
                  </li>
                </>
              ) : (
                <>
                  <li className="py-2">
                    <Logout
                      socket={socket}
                      dispositivo={dispositivo}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    >
                      <MdLogout className="h-6 w-6" />
                    </Logout>
                  </li>
                  <li className="py-2">
                    <Pausa
                      socket={socket}
                      dispositivo={dispositivo}
                      isLoading={isLoading}
                      isPause={isPause}
                    />
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    )
  );
}
