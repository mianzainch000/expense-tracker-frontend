import NextAuth from "next-auth";
import { cookies } from "next/headers";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

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
            }
          );

          if (res?.status === 200) {
            // Set cookies exactly as before
            cookies().set("sessionToken", res.data.token, { secure: true, maxAge: 2 * 24 * 60 * 60 });
            cookies().set("firstName", res.data.user.firstName, { maxAge: 2 * 24 * 60 * 60 });
            cookies().set("lastName", res.data.user.lastName, { maxAge: 2 * 24 * 60 * 60 });

            return { ...res.data.user, message: res.data.message };
          } else {
            throw new Error(res?.data?.message || "Login failed");
          }
        } catch (error) {
          const backendMessage =
            error?.response?.data?.message || error.message || "Invalid email or password";
          throw new Error(backendMessage);
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
