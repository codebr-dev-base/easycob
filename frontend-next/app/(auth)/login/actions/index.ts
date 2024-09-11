"use server";
import { AccessToken, State } from "@/app/types/auth";
import { error } from "console";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";
import { fetchAuth } from "@/app/lib/fetchAuth";
const url = process.env.API_URL ? process.env.API_URL : "";

async function getUser(accessToken: AccessToken) {
  const response = await fetch(`${url}/v1/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken.token}`,
    },
  });

  return await response.json();
}
export async function signin(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const credentials = Object.fromEntries(formData.entries());
  const { email, password } = credentials;

  if (!email || !password) {
    return {
      status: "error",
      message: "The email or password field is not present",
    };
  }

  const response = await fetch(`${url}/v1/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Verifica se a resposta está ok (status 200-299)
  if (!response.ok) {
    const text = await response.text();
    return {
      status: "error",
      message: text,
    };
  }

  const payload: AccessToken = (await response.json()) as AccessToken;

  payload.user = await getUser(payload);
  await createSession(payload);
  redirect("/");
}

export async function logout() {
  const response = await fetchAuth(`${url}/v1/auth/logout`, {
    method: "POST",
  });
  deleteSession();
  redirect("/login");
}
