import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { WalletController } from "./wallet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateWalletSchema } from "./wallet.validtion";

const router = Router()

router.get("/all-wallets", checkAuth(Role.ADMIN), WalletController.getAllWallets)
router.get("/my-wallet", checkAuth(Role.AGENT,Role.USER), WalletController.getMyWallet)

router.get("/:id", checkAuth(Role.ADMIN), WalletController.getSingleWallet)


router.patch("/:id", checkAuth(Role.ADMIN),validateRequest(updateWalletSchema), WalletController.updateWallet)



export const WalletRoutes = router;