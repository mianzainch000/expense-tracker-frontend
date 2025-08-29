import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import axios from "axios";
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
          const res = await axios.post(`${apiConfig.baseUrl}${apiConfig.login}`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (res.status === 200) {
            cookies().set("sessionToken", res.data.token, { secure: true, maxAge: 2 * 24 * 60 * 60 });
            cookies().set("firstName", res.data.user.firstName, { maxAge: 2 * 24 * 60 * 60 });
            cookies().set("lastName", res.data.user.lastName, { maxAge: 2 * 24 * 60 * 60 });
            return { ...res.data.user, message: res.data.message };
          } else {
            throw new Error(res.data?.message || "Login failed");
          }
        } catch (error) {
          throw new Error(error?.response?.data?.message || error.message || "Login failed");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code" },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // 🔹 Google login
      if (account.provider === "google") {
        // Backend call to create user or get JWT
        const res = await axios.post(`${apiConfig.baseUrl}${apiConfig.googleLogin}`, {
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
        });

        if (res.status === 200) {
          cookies().set("sessionToken", res.data.token, { secure: true, maxAge: 2 * 24 * 60 * 60 });
        }
      }
      return true;
    },
  },

  pages: { signIn: "/auth/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
