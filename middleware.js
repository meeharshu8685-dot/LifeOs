import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value, options))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname;

    // 1. Unauthenticated users
    if (!user) {
        // Protect all routes except auth
        if (!path.startsWith('/auth')) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
        return response;
    }

    // 2. Authenticated users
    const isMigrated = user.user_metadata?.is_migrated === true || user.user_metadata?.username;
    // Checking username presence is a safe fallback if is_migrated flag is missing but they have a username

    if (path.startsWith('/auth')) {
        // If they are on setup-pin, allow if NOT migrated
        if (path === '/auth/setup-pin') {
            if (isMigrated) {
                return NextResponse.redirect(new URL('/', request.url));
            }
            return response;
        }

        // If on login/signup and already logged in
        if (isMigrated) {
            return NextResponse.redirect(new URL('/', request.url));
        } else {
            // Logged in but not migrated (e.g. old Google session)
            return NextResponse.redirect(new URL('/auth/setup-pin', request.url));
        }
    }

    // 3. Protected routes & Migration Enforcement
    if (!isMigrated) {
        return NextResponse.redirect(new URL('/auth/setup-pin', request.url));
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
