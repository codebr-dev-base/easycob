"use client";

import { AuthContext } from "@/app/providers/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { logout } from "../../login/actions";
import { fetchAuth } from "@/app/lib/fetchAuth";
import { useCookies } from "next-client-cookies";
import { decrypt } from "@/app/lib/crypto";
import { getSession, getUser } from "@/app/lib/auth";
import { SessionCookie, User } from "@/app/types/auth";

// Ajuste o caminho conforme necessário

export default function FormProfile() {
  const cookies = useCookies();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<SessionCookie | null>(null);

  const url = process.env.API_URL
    ? process.env.API_URL
    : process.env.NEXT_PUBLIC_API_URL;

  let value = useContext(AuthContext);

  const fetchData = () => {
    setUser(getUser());
    setSession(getSession())
  };

  return (
    <div className="flex-col">
      {user && <pre className="flex">{JSON.stringify(user, null, 2)}</pre>}

      {session && (
        <pre className="flex">{JSON.stringify(session, null, 2)}</pre>
      )}

      <button className="btn-primary" onClick={fetchData}>
        Fetch Data with Auth {value}
      </button>

      <form action={logout}>
        <button className="btn-primary" type="submit">
          logout
        </button>
      </form>
    </div>
  );
}
