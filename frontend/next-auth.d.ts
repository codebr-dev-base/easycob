import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /* Returned by `useAuth`, `getSession` and `getServerSession` */
  interface Session extends DefaultSession {
    user: {
      id: number;
      email: string;
      name: string;
      cpf: string;
      skills: any[];
      isActived: boolean;
      rememberMeToken: string;
      createdAt: string;
      updatedAt: string;
    };
  }
}
