"use client";
import React, { useEffect, useState } from "react";
import { logout } from "../../login/actions";

export default function ExpiredCredentials() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Fazendo a asserção de tipo para HTMLFormElement
      const form = document.getElementById("logoutForm") as HTMLFormElement;
      if (form) {
        form.requestSubmit(); // Usando requestSubmit() em vez de submit()
      }
    }
  }, [countdown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-6">
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          Suas credenciais expiraram ou são inválidas
        </h2>
        <form
          id="logoutForm"
          action={logout}
          method="POST"
          className="p-1 flex flex-col items-center justify-center"
        >
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg max-w-[80%]"
          >
            Sair
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          Você será desconectado automaticamente em {countdown} segundos...
        </p>
      </div>
    </div>
  );
}
