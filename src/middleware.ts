import { apiAuthPrefix, authRoutes, DEFAUTL_AUTH_REDIRECT, DEFAUTL_UNAUTH_REDIRECT, privateRoute } from "./routes"

import { auth } from "@/auth"

export default auth((req) => {
    try {
        const path = req.nextUrl?.pathname

        const isLoggedIn = !!req.auth
        const isApiAuthRoute = path.startsWith(apiAuthPrefix)
        // const isPublicRoute = publicRoutes.includes(path)
        const isPrivateRoute = privateRoute.some(route => path.startsWith(route))
        const isAuthRoute = authRoutes.includes(path)

        // console.log(`🔥`, { isLoggedIn, isAuthRoute, isPrivateRoute })

        if (isApiAuthRoute || (!isPrivateRoute && !isAuthRoute)) {
            return;
        }

        if (isAuthRoute) {
            if (isLoggedIn) return Response.redirect(new URL(DEFAUTL_AUTH_REDIRECT, req.nextUrl))
            return;
        }

        if (!isLoggedIn && isPrivateRoute) {
            let callback = req.nextUrl.pathname
            if (req.nextUrl.search) callback += req.nextUrl.search
            const encodedCallback = encodeURIComponent(callback)
            return Response.redirect(new URL(`${DEFAUTL_UNAUTH_REDIRECT}?callback=${encodedCallback}`, req.nextUrl))
        }

    } catch (error) {
        console.log({ error })
        return Response.redirect(new URL('/', req.nextUrl))
    }

})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ]
}