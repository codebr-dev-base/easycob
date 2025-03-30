"use client";
import Image from "next/image";
import easycobWhite from "@/app/assets/img/easycob_white.png";
import logo from "@/app/assets/img/logo.svg";
import { useEffect, useState } from "react";
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
import { Socket } from "socket.io-client";
import { useSocket } from "@/app/hooks/useSocket";
import { toast } from "@/hooks/use-toast";

interface ModuleLink {
  href: string;
  label: string;
}

interface ModuleConfig {
  label: string;
  icon: React.ElementType; // Icone como componente
  links: ModuleLink[];
}

const moduleLinks: Record<string, ModuleConfig> = {
  operator: {
    label: "Operador",
    icon: HiOutlinePhone,
    links: [
      { href: "/operation/clients", label: "Clientes" },
      { href: "/operation/following", label: "Acompanhamento" },
      { href: "/operation/loyals", label: "Fidelizados" },
      { href: "/operation/tags", label: "Tags" },
      { href: "/operation/external", label: "Externos" },
    ],
  },
  supervisor: {
    label: "Supervisão",
    icon: LuListTodo,
    links: [
      { href: "/supervision/actions", label: "Acionamentos" },
      { href: "/supervision/campaigns", label: "Campanhas" },
      { href: "/supervision/following", label: "Acompanhamento" },
    ],
  },
  admin: {
    label: "Admin",
    icon: LuLock,
    links: [
      { href: "/admin/users", label: "Usuários" },
      { href: "/admin/tags", label: "Tags" },
      { href: "/admin/external/files", label: "Base Externa" },
    ],
  },
};

interface MenuProps {
  modules: string[]; // Módulos que o usuário pode acessar
  isExpanded?: boolean; // Controle do estado visual
  toggleSidebar?: () => void;
}

const DynamicMenu: React.FC<MenuProps> = ({
  modules,
  isExpanded = true,
  toggleSidebar,
}) => {
  return (
    <Accordion type="multiple">
      {modules.map((module) => {
        const moduleConfig = moduleLinks[module];
        if (!moduleConfig) return null; // Ignorar módulos inválidos

        const Icon = moduleConfig.icon;

        return (
          <AccordionItem
            key={module}
            value={`${module}-menu`}
            className="border-none"
          >
            <AccordionTrigger>
              <div className="w-full flex gap-2 items-center">
                <div className="cursor-pointer" onClick={toggleSidebar}>
                  <Icon size={24} />
                </div>

                <span className={`${!isExpanded ? "hidden" : ""}`}>
                  {moduleConfig.label}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent
              className={`flex flex-col gap-4 items-start translate-x-8 w-full ${
                !isExpanded ? "hidden" : ""
              }`}
            >
              {moduleConfig.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

const DynamicMenuMobile: React.FC<MenuProps> = ({ modules }) => {
  return (
    <Accordion type="multiple" className="ml-4">
      {modules.map((module) => {
        const moduleConfig = moduleLinks[module];
        if (!moduleConfig) return null; // Ignorar módulos inválidos

        const Icon = moduleConfig.icon;

        return (
          <AccordionItem
            key={module}
            value={`${module}-menu`}
            className="border-none"
          >
            <AccordionTrigger>
              <div className="w-full flex gap-2 items-center">
                <Icon size={24} />
                <span>{moduleConfig.label}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent
              className={`flex flex-col gap-4 items-start translate-x-8 w-full`}
            >
              {moduleConfig.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [accordionSections, setAccordionSections] = useState<string[]>([]);
  const [webhookData, setWebhookData] = useState(null);
  const socket = useSocket();

  // Escuta os dados do webhook enviados pelo servidor
  useEffect(() => {
    if (socket) {
      socket.on("webhook", (data) => {
        setWebhookData(data);
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

  // Hierarquia de acesso
  const moduleHierarchy = {
    admin: ["admin", "supervisor", "operator"],
    supervisor: ["supervisor", "operator"],
    operator: ["operator"],
  } as const; // Use "as const" para garantir a imutabilidade e inferência precisa dos tipos

  // Função para extrair módulos e aplicar a hierarquia
  // Função para extrair módulos e aplicar a hierarquia
  function getUserModules(user: any): string[] {
    // Extração dos módulos
    const userModules = user.skills.map((skill: any) => skill.module.shortName);

    // Determinar todos os módulos acessíveis com base na hierarquia
    const accessibleModules = new Set<string>();

    userModules.forEach((userModule: any) => {
      if (userModule in moduleHierarchy) {
        // Explicitamente informe o TypeScript que userModule é uma chave válida
        const hierarchyModules =
          moduleHierarchy[userModule as keyof typeof moduleHierarchy];
        hierarchyModules.forEach((hierarchicalModule) =>
          accessibleModules.add(hierarchicalModule)
        );
      }
    });

    return Array.from(accessibleModules);
  }

  const accessibleModules = getUserModules(user);

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
        <DynamicMenuMobile modules={accessibleModules} />
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
            <div className="justify-center items-start hidden md:flex transition-all duration-300 ease-in-out">
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
            className={`flex flex-col  space-y-6 ${
              !isExpanded ? "ml-1 items-center" : "ml-4"
            }`}
          >
            <DynamicMenu
              modules={accessibleModules}
              isExpanded={isExpanded}
              toggleSidebar={toggleSidebar}
            />
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
            <Button
              variant="destructive"
              type="submit"
              className="max-w-[80%]"
              size={!isExpanded ? "sm" : "default"}
            >
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
