import { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const config = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }
        
        try {
          const user = await prisma.user.findUnique({ 
            where: { email: credentials.email as string } 
          })
          
          if (!user || !user.password) {
            throw new Error("Invalid credentials")
          }
          
          const valid = await bcrypt.compare(
            credentials.password as string, 
            user.password
          )
          
          if (!valid) {
            throw new Error("Invalid credentials")
          }
          
          return { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw new Error("Authentication failed")
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })
          
          if (existingUser) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name,
                image: user.image,
                emailVerified: new Date(),
              }
            })
          }
        } catch (error) {
          console.error('Error in signIn callback:', error)
        }
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      // When user signs in, add their role to the token
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      
      // Handle session updates (if you update profile, etc.)
      if (trigger === "update" && session) {
        token.name = session.user.name
        token.email = session.user.email
      }
      
      // For Google sign-in, fetch role from database
      if (token.email && !token.role) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true }
          })
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      // Add user id and role from token to session
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { 
    strategy: "jwt"
  },
} as NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)