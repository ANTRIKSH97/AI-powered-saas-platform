import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'; // array
import { NextResponse } from 'next/server';

console.log("✅ Clerk Key Middleware:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const isPublicRoute = createRouteMatcher([ // they can match it only
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
])
const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])


export default clerkMiddleware((auth, req) => {
    const {userId} = auth();
    const currentUrl = new URL(req.url)
     const isAccessingDashboard = currentUrl.pathname === "/home"
     const isApiRequest = currentUrl.pathname.startsWith("/api")

     // If user is logged in and accessing a public route but not the dashboard
    if(userId && isPublicRoute(req) && !isAccessingDashboard) {
        return NextResponse.redirect(new URL("/home", req.url))
    }
    //not logged in
    if(!userId){
        // If user is not logged in and trying to access a protected route
        if(!isPublicRoute(req) && !isPublicApiRoute(req) ){
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }

        // If the request is for a protected API and the user is not logged in
        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }
    }
    return NextResponse.next()

})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

