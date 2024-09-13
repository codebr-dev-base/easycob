"use client";
import Image from "next/image";
import easycobWhite from "@/app/assets/img/easycob_white.svg";
import logo from "@/app/assets/img/logo.svg";
import React, { useState } from "react";
import { FaHome, FaUser, FaCog, FaBars } from "react-icons/fa"; // Exemplo de ícones
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaXmark } from "react-icons/fa6"; // Ícones para expandir/recolher
import Link from "next/link";
import { getUser, getUserInitials } from "@/app/lib/auth";
import { logout } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const user = getUser();
  const initials = getUserInitials();

  return (
    <div>
      {/* Botão para abrir sidebar no mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-priamry text-white rounded-md"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <FaXmark size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar no mobile (ocupa a tela inteira) */}
      <div
        className={`fixed inset-0 bg-primary text-white z-40 transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <button
          className="absolute top-4 right-4 p-2 bg-primary text-white rounded-md"
          onClick={toggleMobileSidebar}
        >
          Fechar
        </button>
        <nav className="mt-16 flex flex-col items-center">
          <a href="#" className="p-4 text-lg">
            Home
          </a>
          <a href="#" className="p-4 text-lg">
            Usuário
          </a>
          <a href="#" className="p-4 text-lg">
            Configurações
          </a>
        </nav>
      </div>

      {/* Sidebar para telas médias e maiores */}
      <div className="flex">
        <aside
          className={`bg-primary text-white h-screen hidden lg:flex flex-col items-center justify-between transition-all duration-300 ease-in-out relative px-2 shadow-foreground/50 shadow-[2px_0px_4px] ${
            isExpanded ? "w-[15%]" : "w-[5%]"
          }`}
        >
          {/* Ícones ou menu compacto */}
          <header className="h-20 my-3">
            {isExpanded ? (
              <div className="justify-center items-center hidden md:flex transition-all duration-300 ease-in-out">
                <Image
                  src={easycobWhite}
                  alt="Easycob white"
                  width={256}
                  height={128}
                />
              </div>
            ) : (
              <div className="justify-center items-center hidden md:flex transition-all duration-300 ease-in-out">
                <Image src={logo} alt="Easycob wwhite" width={64} height={64} />
              </div>
            )}
          </header>
          <main className="h-full">
            <nav className="flex flex-col items-center space-y-6">
              <a href="#" className="text-2xl">
                <FaHome />
              </a>
              <a href="#" className="text-2xl">
                <FaUser />
              </a>
              <a href="#" className="text-2xl">
                <FaCog />
              </a>
            </nav>
          </main>
          <footer
            className={`flex items-center justify-between w-full p-3 ${isExpanded ? "flex-row" : "flex-col"}`}
          >
            <Link href="/profile" className="p-1">
              <div className="p-1 bg-slate-300 rounded-3xl justify-start items-center gap-2 flex text-blue-600">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex justify-center">
                  <div className="m-auto font-medium">{initials ?? "U"}</div>
                </div>
              </div>
            </Link>
            <form
              action={logout}
              className="p-1 flex items-center justify-center"
            >
              <Button
                variant="destructive"
                type="submit"
                className="max-w-[80%]"
              >
                Sair
              </Button>
            </form>
          </footer>
        </aside>

        {/* Botão para expandir/recolher sidebar, posicionado na borda da tela */}
        <button
          className={`absolute top-1/2 transform -translate-y-1/2 bg-primary text-white rounded-r-lg py-2 px-0 transition-all duration-300 hidden lg:flex shadow-foreground shadow-[2px_0px_4px] ${
            isExpanded ? "left-[15%]" : "left-[5%]"
          }`}
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <FiChevronLeft size={24} />
          ) : (
            <FiChevronRight size={24} />
          )}
        </button>

        {/* Conteúdo principal */}
        <div className="w-full flex-1">{children}</div>
      </div>
    </div>
  );
}
