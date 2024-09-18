import { ReactNode } from "react";

type HeaderProps = {
  title?: string;
  children?: ReactNode;
};

export default function Header({ title, children }: HeaderProps) {
  return (
    <header className="w-full h-20 px-5 bg-primary justify-between items-center inline-flex text-white">
      <h1 className="text-white font-medium text-2xl">{title ? title : ""}</h1>
      <div className="grow shrink basis-0 self-stretch pl-2.5 pr-4 py-2.5 justify-end items-center gap-9 flex">
        {children}
      </div>
    </header>
  );
}
