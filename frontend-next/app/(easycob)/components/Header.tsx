
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getUser, getUserInitials } from "@/app/lib/auth";

export default function Header() {
  const user = getUser();
  const initials = getUserInitials();
  return (
    <div className="Header w-full h-20 px-5 bg-blue-600 justify-between items-center inline-flex text-white">
      <div className="grow shrink basis-0 self-stretch pl-2.5 pr-4 py-2.5 justify-end items-center gap-9 flex">
        <nav className="justify-end items-center gap-1 flex">
          <Link
            href="/operation"
            className={buttonVariants({ variant: "default" })}
          >
            Operação
          </Link>
          <Link
            href="/supervision"
            className={buttonVariants({ variant: "default" })}
          >
            Supervisão
          </Link>
          <Link
            href="/admin"
            className={buttonVariants({ variant: "default" })}
          >
            Admin
          </Link>
        </nav>
        <Link href="/profile">
          <div className="md:pl-1 md:pr-6 md:py-1 bg-slate-300 rounded-3xl justify-start items-center gap-2 flex text-blue-600">
            <div className="Avatar w-10 h-10 relative flex-col justify-start items-start flex">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex justify-center">
                <div className="m-auto">{initials}</div>
              </div>
            </div>
            <div className="text-sm font-normal hidden md:flex">
              Olá, {user?.name}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
