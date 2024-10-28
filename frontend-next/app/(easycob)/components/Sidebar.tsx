"use client";
import Image from "next/image";
import easycobWhite from "@/app/assets/img/easycob_white.png";
import logo from "@/app/assets/img/logo.svg";
import { useState } from "react";
import { FaBars } from "react-icons/fa"; // Exemplo de ícones
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { LuListTodo, LuLock } from "react-icons/lu";
import { HiOutlinePhone } from "react-icons/hi";
import { FaXmark } from "react-icons/fa6"; // Ícones para expandir/recolher
import Link from "next/link";
import { getUser, getUserInitials } from "@/app/lib/auth";
import { logout } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Suspense } from "react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [accordionSections, setAccordionSections] = useState<string[]>([]);

  const toggleSidebar = () => {
    if (isExpanded) {
      setAccordionSections([]);
    }
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const user = getUser();
  const initials = getUserInitials();

  return (
    <div className="flex">
      {/* Botão para abrir sidebar no mobile */}
      <button
        className="md:hidden fixed top-2 right-2 z-50 p-2 bg-primary text-white rounded-md"
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
        {/* <button
          className="absolute top-4 right-4 p-2 bg-primary text-white rounded-md"
          onClick={toggleMobileSidebar}
        >
          Fechar
        </button> */}
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
      <aside
        className={`fixed bg-primary text-white min-h-screen hidden md:flex flex-col items-center justify-between transition-all duration-300 ease-in-out  px-2 py-1  shadow ${
          isExpanded ? "w-[15%]" : "w-[5%]"
        }`}
      >
        {/* Botão para expandir/recolher sidebar */}
        <button
          className={`absolute top-1/2 left-[100%] transform -translate-y-1/2 bg-primary text-white rounded-r-xl transition-all duration-300 hidden md:flex h-12 w-6 justify-start items-center -50`}
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <FiChevronLeft size={24} />
          ) : (
            <FiChevronRight size={24} />
          )}
        </button>
        {/* Conteúdo da sidebar */}
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
              <Image
                src={logo}
                alt="Easycob white"
                width={128}
                height={128}
                className="min-w-10"
                priority={true}
              />
            </div>
          )}
        </header>
        <main className="h-full w-full">
          <nav
            className={`flex flex-col items-center space-y-6 ${
              !isExpanded ? "ml-1" : "ml-4"
            }`}
          >
            <Accordion
              type="multiple"
              className={`w-full min-w-fit data-[disabled]:w-0 transition-all`}
              disabled={!isExpanded}
              value={accordionSections}
              onValueChange={setAccordionSections}
            >
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
                  <Link href={"/operation/clients"}>Clientes</Link>
                  <Link href={"/operation/followup"}>Acompanhamento</Link>
                  <Link href={"/operation/loyal"}>Fidelizados</Link>
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
                  <Link href={"/supervision/actions"}>Acionamentos</Link>
                  <Link href={"/supervision/campaigns"}>Campanhas</Link>
                  <Link href={"/supervision/discounts"}>Descontos</Link>
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
          className={`flex items-center justify-between w-full p-3 ${
            isExpanded ? "flex-row" : "flex-col"
          }`}
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
            <Button variant="destructive" type="submit" className="max-w-[80%]" size={!isExpanded ? "sm" : "default"}>
              Sair
            </Button>
          </form>
        </footer>
      </aside>

      {/* Conteúdo principal ajustável */}
      <div
        className={`transition-all duration-300 flex-1 w-full ${
          isExpanded ? "md:ml-[15%] md:w-[85%]" : "md:ml-[5%] md:w-[95%]"
        }`}
      >
        <Suspense fallback={<p>Loading feed...</p>}>{children}</Suspense>
      </div>
    </div>
  );
}
