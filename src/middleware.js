import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;
    
    // Protected paths that require authentication
    const protectedPaths = ['/dashboard', '/profile'];
    
    // If user is not logged in and trying to access protected routes, redirect to login
    if (!token && protectedPaths.includes(path)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Optionally, if user is logged in and tries to access /login or /signup,
    // you might handle that on the client side.
    // (Or you can set up a separate middleware for those routes.)
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard', '/profile']  // Only apply middleware to protected routes
};
