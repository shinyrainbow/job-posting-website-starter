import NextAuth from "next-auth";

import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";


export const {auth, handlers, signIn, signOut} = NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [Github],
    adapter: PrismaAdapter(prisma), // important because we using prisma ORM
    callbacks: {
        async jwt({token, user}) { // after user signin
            if(user){
                token.id= user.id
                token.name = user.name
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
              session.user.id = token.id as string;
              session.user.name = token.name as string;
            }
            return session;
          },
    }
})