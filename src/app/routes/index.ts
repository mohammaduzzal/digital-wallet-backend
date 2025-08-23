import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { TransactionRoutes } from "../modules/transaction/transaction.route";
import { ContactRoutes } from "../modules/contact/contact.route";

export const router = Router()


const moduleRoutes=[
    {
        path : "/user",
        route : UserRoutes
    },
    {
        path : "/auth",
        route : AuthRoutes
    },
    {
        path : "/wallet",
        route : WalletRoutes
    },
    {
        path : "/transaction",
        route : TransactionRoutes
    },
    {
        path : "/contact",
        route : ContactRoutes
    },
]



moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})