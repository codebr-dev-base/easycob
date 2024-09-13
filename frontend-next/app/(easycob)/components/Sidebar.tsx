"use client";
import Image from "next/image";
import easycobWhite from "@/app/assets/img/easycob_white.svg";
import logo from "@/app/assets/img/logo.svg";
import React, { useState } from "react";
import { FaHome, FaUser, FaCog, FaBars } from "react-icons/fa"; // Exemplo de ícones
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { LuListTodo, LuLock } from "react-icons/lu";
import { HiOutlinePhone } from "react-icons/hi";
import { FaXmark } from "react-icons/fa6"; // Ícones para expandir/recolher
import Header from "@/app/(easycob)/components/Header";
import Link from "next/link";
import { getUser, getUserInitials } from "@/app/lib/auth";
import { logout } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";

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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md"
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
      <div className="flex ">
        <aside
          className={`bg-primary text-white h-screen hidden lg:flex flex-col items-center justify-between transition-all duration-300 ease-in-out relative px-5 ${
            isExpanded ? "w-[15%]" : "w-[5%]"
          }`}
        >
          {/* Ícones ou menu compacto */}
          <header className="h-20 my-3">
            {isExpanded ? (
              <div className="justify-center items-center hidden md:flex transition-all duration-300 ease-in-out">
                <Image
                  src={easycobWhite}
                  alt="Easycob wwhite"
                  width={256}
                  height={128}
                />
              </div>
            ) : (
              <div className="justify-center items-center hidden md:flex transition-all duration-300 ease-in-out">
                <Image src={logo} alt="Easycob white" width={64} height={64} />
              </div>
            )}
          </header>
          <main className="h-full w-full">
            <nav className="flex flex-col items-center space-y-6">
              <Accordion type="multiple" className="w-full min-w-fit">
                <AccordionItem value="operator-menu" className="border-none">
                  <AccordionTrigger>
                    <div className="w-full flex gap-2 items-center">
                      <HiOutlinePhone size={24} />
                      <span className={`${!isExpanded ? "hidden" : ""} `}>
                        Operador
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 items-start translate-x-8 w-full">
                    <Link href={"/operator/clients"}>Clientes</Link>
                    <Link href={"/operator/followup"}>Acompanhamento</Link>
                    <Link href={"/operator/loyal"}>Fidelizados</Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="supervisor-menu" className="border-none">
                  <AccordionTrigger>
                    <div className="w-full flex gap-2 items-center">
                      <LuListTodo size={24} />
                      <span className={`${!isExpanded ? "hidden" : ""} `}>
                        Supervisão
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 items-start translate-x-8 w-full">
                    <Link href={"/supervisor/actions"}>Acionamentos</Link>
                    <Link href={"/supervisor/discounts"}>Descontos</Link>
                    <Accordion type="multiple">
                      <AccordionItem
                        value="submenu-campaings"
                        className="border-none"
                      >
                        <AccordionTrigger>Campanhas</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 items-start translate-x-8 w-full">
                          <Link href={"/supervisor/campaings/sms"}>SMS</Link>
                          <Link href={"/supervisor/campaings/sms"}>Email</Link>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="admin-menu" className="border-none">
                  <AccordionTrigger>
                    <div className="w-full flex gap-2 items-center">
                      <LuLock size={24} />
                      <span className={`${!isExpanded ? "hidden" : ""} `}>
                        Admin
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 items-start translate-x-8 w-full">
                    <Link href={"/admin"}>Usuários</Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </nav>
          </main>
          <footer
            className={`flex items-center justify-between w-full p-3 ${isExpanded ? "flex-row" : "flex-col"}`}
          >
            <Link href="/profile" className="p-1">
              <div className="p-1 bg-slate-300 rounded-3xl justify-start items-center gap-2 flex text-blue-600">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex justify-center">
                  <div className="m-auto">{initials}</div>
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
          className={`absolute top-1/2 transform -translate-y-1/2 bg-primary text-white rounded-r-lg py-2 px-0 transition-all duration-300 hidden lg:flex ${
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
        <div className="w-full flex-1">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
