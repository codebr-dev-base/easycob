import Image from "next/image";
import easycobWhite from "@/app/assets/img/easycob_white.svg";
import FormLogin from "./components/FormLogin";


export default function Home() {

  return (
    <main className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-full h-full md:h-full md:max-h-screen p-0 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Coluna Esquerda - Formulário de Login */}
        <div className="card max-md  ">
          <div className="flex flex-col justify-center order-2 md:order-1 h-full w-full py-12">
            <FormLogin />
          </div>
        </div>

        {/* Coluna Direita - Texto de Exemplo com Gradiente */}
        <div className="hidden md:flex flex-col justify-center order-1 md:order-2 bg-gradient-to-r from-[#226AD3] to-[#0FA573] text-white p-6  h-full w-full">
          <div className="w-8/12 m-auto">
            <Image
              src={easycobWhite}
              alt="Easycob wwhite"
              width={800}
              height={600}
            />
          </div>
          <div className="mb-6">
            <p className="text-center text-xs">Um produto de Yuan Soluções</p>
          </div>
        </div>
      </div>
    </main>
  );
}
