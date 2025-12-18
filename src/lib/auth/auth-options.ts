import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getDb } from "@/lib/mongodb/client"
import { ObjectId } from "mongodb"

function getRoleFromEmail(email: string): 'admin' | 'faculty' | 'student' {
  const lowerEmail = email.toLowerCase()
  
  if (lowerEmail.endsWith('@mitsgwalior.in')) {
    if (lowerEmail.startsWith('admin') || lowerEmail.includes('.admin@')) {
      return 'admin'
    }
    return 'faculty'
  }
  
  if (lowerEmail.endsWith('@mitsgwl.ac.in')) {
    return 'student'
  }
  
  return 'student'
}

function validateEmailDomain(email: string): boolean {
  const lowerEmail = email.toLowerCase()
  return lowerEmail.endsWith('@mitsgwalior.in') || lowerEmail.endsWith('@mitsgwl.ac.in')
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase()
      
      if (!email || !validateEmailDomain(email)) {
        return '/login?error=Please use your institutional Google account (@mitsgwl.ac.in or @mitsgwalior.in)'
      }
      
      const db = await getDb()
      const role = getRoleFromEmail(email)
      
      const existingUser = await db.collection('users').findOne({ email })
      
      if (existingUser) {
        await db.collection('users').updateOne(
          { email },
          { 
            $set: { 
              full_name: user.name || existingUser.full_name,
              updated_at: new Date().toISOString()
            }
          }
        )
      } else {
        await db.collection('users').insertOne({
          id: new ObjectId().toHexString(),
          email,
          full_name: user.name || '',
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
      
      return true
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const db = await getDb()
        const dbUser = await db.collection('users').findOne({ email: user.email.toLowerCase() })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'admin' | 'faculty' | 'student'
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}
