"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, ReactNode } from "react";
import { Socket } from "socket.io-client";

const Logout = ({
  children,
  socket,
  dispositivo,
  isLoading,
  setIsLoading,
}: {
  children: ReactNode;
  socket: Socket;
  dispositivo: string;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  const handleLogout = () => {
    if (!socket) {
      console.error("Socket não está disponível.");

      return;
    }
    socket.emit("logout", { dispositivo });
    setIsLoading(true);
  };

  return (
    <>
      <Button
        onClick={handleLogout}
        className={`h-10 w-10 p-0 bg-red-500 ${
          isLoading ? "animate-pulse" : ""
        }`}
        disabled={isLoading}
      >
        {children}
      </Button>
    </>
  );
};

export default Logout;
