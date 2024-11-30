/*
* An array of routes that are accessible to the public
* These routes do not require authentication
* @type {string[]}
*/
export const publicRoutes:string[] = [
    '/dashboard',
    '/profile',
    '/settings',
    '/settings/.*',
]

export const privateRoute:string[] = [
    '/dashboard',
    '/profile',
    '/settings',
    '/settings/*',
    '/store/checkout',
]

/*
* An array of routes that are used for the authentication process
* These routes will redirect logged in users to /profile
* @type {string[]}
*/
export const authRoutes = [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/error',
]

/*
* The prefix for the authentication API routes
* Routes that start with this prefix are used for authentication
* @type {string}
*/
export const apiAuthPrefix = '/api/auth'


/*
* The default redirect route after a successful login
* This route is used when the user is redirected after a successful login
* @type {string}
*/
export const DEFAUTL_AUTH_REDIRECT = '/store'

/*
* The default redirect route if unauthorized
* This route is used when the user is redirected if they are not authorized
* @type {string}
*/
export const DEFAUTL_UNAUTH_REDIRECT = '/auth/sign-in'