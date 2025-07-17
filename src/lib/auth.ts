import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // Vérification simple pour test
        if (credentials.email === 'test@42.fr' && credentials.password === 'test') {
          return { id: '1', email: 'test@42.fr', name: 'Test User' }
        }
        
        return null
      }
    })
    // Provider 42 désactivé temporairement
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin'
  }
}