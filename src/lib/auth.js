import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.json');

// Ensure data directory and files exist
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '[]');
}

if (!fs.existsSync(BLOGS_FILE)) {
  fs.writeFileSync(BLOGS_FILE, '[]');
}
export const authOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
          const user = users.find(u => u.email === credentials.email);
          
          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              image: user.image || null
            };
          }
          return null;
        }
      })
    ],
    callbacks: {
      async jwt({ token, user }) {
        // When the user is first created, add their properties to the token.
        if (user) {
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.email = user.email;
        }
        return token;
      },
      async session({ session, token }) {
        // Make sure the session includes these properties.
        session.user.id = token.sub;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        return session;
      }
    },
    pages: {
      signIn: '/login',
    },
  };
// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
//         const user = users.find(u => u.email === credentials.email);
        
//         if (user && await bcrypt.compare(credentials.password, user.password)) {
//           return {
//             id: user.id,
//             email: user.email,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             image: user.image || null
//           };
//         }
//         return null;
//       }
//     })
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.sub;
//       }
//       return session;
//     }
//   },
//   pages: {
//     signIn: '/login',
//   },
// };
