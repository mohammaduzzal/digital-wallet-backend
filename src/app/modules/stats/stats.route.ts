import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { statsController } from "./stats.controller";

const router = Router()

router.get("/users", checkAuth(Role.ADMIN), statsController.getUserStats)

router.get("/transactions", checkAuth(Role.ADMIN), statsController.getTransactionStats)





export const StatsRoutes = router