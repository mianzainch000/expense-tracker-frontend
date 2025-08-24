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
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axiosClient.post(
            `${apiConfig.baseUrl}${apiConfig.login}`,
            {
              email: credentials?.email,
              password: credentials?.password,
            },
          );
          if (res?.status === 201) {
            cookies().set("sessionToken", res?.data?.token, {
              secure: true,
              maxAge: 2 * 24 * 60 * 60,
            });
            cookies().set("firstName", res?.data?.user?.firstName, {
              maxAge: 2 * 24 * 60 * 60,
            });
            cookies().set("lastName", res?.data?.user?.lastName, {
              maxAge: 2 * 24 * 60 * 60,
            });
            return res.data; // user object
          } else {
            throw new Error(res?.data?.message || "Login failed");
          }
        } catch (error) {
          console.error(
            "Authorize error:",
            error?.response?.data || error.message,
          );
          throw new Error(
            error?.res?.data?.message || "Invalid email or password",
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
