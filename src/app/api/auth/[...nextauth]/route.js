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

          if (res?.status === 200) {
            // ✅ Success, set cookies
            cookies().set("sessionToken", res.data.token, {
              secure: true,
              maxAge: 2 * 24 * 60 * 60,
            });
            cookies().set("firstName", res.data.user.firstName, {
              maxAge: 2 * 24 * 60 * 60,
            });
            cookies().set("lastName", res.data.user.lastName, {
              maxAge: 2 * 24 * 60 * 60,
            });

            // 🔹 Include backend message in user object
            return { ...res.data.user, message: res.data.message };
          } else {
            // 🔹 Backend sent error message
            throw new Error(res?.data?.message || "Login failed");
          }
        } catch (error) {
          console.error(
            "Authorize error:",
            error?.response?.data || error.message,
          );

          // 🔹 Pass backend error message directly
          const backendMessage =
            error?.response?.data?.message ||
            error.message ||
            "Invalid email or password";
          throw new Error(backendMessage);
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
