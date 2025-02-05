import { cookies } from "next/headers";
import FormProfile from "./components/FormProfile";
import { decrypt, encrypt } from "@/app/lib/crypto";
import { ISessionCookie } from "@/app/interfaces/auth";

export default function Home() {
  return (
    <main className="bg-gray-100 flex justify-center items-center h-screen">
      <FormProfile />
    </main>
  );
}
