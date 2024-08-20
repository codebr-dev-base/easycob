import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";
const config = useRuntimeConfig();

type TokenType = {
  type: string;
  token: string;
  expiresAt: string;
};

type UserType = {
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

export default NuxtAuthHandler({
  pages: {
    // Change the default behavior to use `/login` as the path for the sign-in page
    signIn: "/auth/login",
  },
  // A secret string you define, to ensure correct encryption
  secret: config.public.authSecret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "exemple@codebr.dev",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "secret",
        },
      },
      async authorize(credentials: { email: string; password: string }) {
        const API_BASE_URL = config.public.apiBase;
        try {
          const payload = {
            email: credentials.email,
            password: credentials.password,
          };

          const userTokens = await $fetch<TokenType>(
            `${API_BASE_URL}/v1/auth/login`,
            {
              method: "POST",
              body: payload,
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          const userDetails = await $fetch<UserType>(
            `${API_BASE_URL}/v1/auth/me`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${userTokens?.token}`,
              },
            }
          );

          const user = {
            id: userDetails.id,
            email: userDetails.email,
            name: userDetails.name,
            cpf: userDetails.cpf,
            skills: userDetails.skills,
            isActived: userDetails.isActived,
            token: userTokens,
          };

          //console.log(userTokens);
          return user;
        } catch (error) {
          console.warn("Error logging in", error);

          return null;
        }
      },
    }),
  ],
  /*   session: {
    strategy: "jwt",
  }, */

  callbacks: {
    async jwt({ token, user, account }) {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        if ((user as any).accessToken) {
          token.accessToken = (user as any).accessToken;
        }
        if ((user as any).accessTokenExpires) {
          token.accessTokenExpires = (user as any).accessTokenExpires;
        }
        if ((user as any).token) {
          token.token = (user as any).token;
        }
        token.id = user ? user.id || "" : "";
        token.user = user;
      }
      return Promise.resolve(token);
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).accessTokenExpires = token.accessTokenExpires;
      (session as any).token = token.token;
      (session as any).id = token.id;
      (session as any).user = token.user;
      return Promise.resolve(session);
    },
  },
});
