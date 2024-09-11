"use client";

import { AuthContext } from "@/app/providers/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { logout } from "../../login/actions";
import { fetchAuth } from "@/app/lib/fetchAuth";
import { useCookies } from "next-client-cookies";
import { decrypt } from "@/app/lib/crypto";

// Ajuste o caminho conforme necessário

export default function FormProfile() {
  const cookies = useCookies();
  const router = useRouter();
  const [user, setUser] = useState(null);

  const url = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "";

  let value = useContext(AuthContext);

  const fetchData = () => {
    console.log('user:')
    const easycobSession = cookies.get("easycob_session");
    console.log(easycobSession)
    if (!easycobSession) {
      return null;
    }
  
    const accessToken = decrypt(easycobSession);
    console.log(accessToken)
    setUser(accessToken.user)
  };

  return (
    <div className="flex-col">
      <pre className="flex">{JSON.stringify(user, null, 2)}</pre>
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
