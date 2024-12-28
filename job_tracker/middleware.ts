//applies auth to the whole site for protection
export {default} from "next-auth/middleware"

//can apply next-auth to specific routes
// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// ex: export const config = {matcher: ["/extra" ,"/dashboard" ]}