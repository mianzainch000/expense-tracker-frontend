import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

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
          const res = await axiosClient.post(apiConfig.login, {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (res?.status === 201) {
            const user = res.data.user;
            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              token: res.data.token,
            };
          } else {
            throw new Error(res?.data?.message || "Login failed");
          }
        } catch (error) {
          console.error(
            "Authorize error:",
            error?.response?.data || error.message
          );
          throw new Error(
            error?.response?.data?.message || "Invalid email or password"
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
