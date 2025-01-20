import NextAuth from "next-auth";
import { cookies } from "next/headers";
import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const res = await axiosClient.post(apiConfig.login, {
            email: credentials?.email,
            password: credentials?.password,
          });
          if (res?.status === 200) {
            cookies().set("sessionToken", res?.data?.data?.token, {
              secure: true,
              maxAge: 2 * 24 * 60 * 60,
            });
            cookies().set("firstName", res?.data?.data?.user?.firstName, {
              maxAge: 2 * 24 * 60 * 60,
            });
            cookies().set("lastName", res?.data?.data?.user?.lastName, {
              maxAge: 2 * 24 * 60 * 60,
            });
            return res.data;
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
