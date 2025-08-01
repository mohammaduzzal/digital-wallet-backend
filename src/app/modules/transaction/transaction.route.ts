import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTransactionZodSchema } from "./transaction.validation";
import { TransactionController } from "./transaction.controller";

const router = Router()


// user only- add money,withdraw money,send money route

router.post("/deposit", checkAuth(Role.USER),validateRequest(createTransactionZodSchema), TransactionController.deposit)

router.post("/withdraw", checkAuth(Role.USER),validateRequest(createTransactionZodSchema), TransactionController.withdraw)

router.post("/send", checkAuth(Role.USER),validateRequest(createTransactionZodSchema), TransactionController.sendMoney)



// get all transaction -admin
router.get("/all-transactions", checkAuth(Role.ADMIN), TransactionController.getAllTransactions)

// get my transactions -user/agent
router.get("/me", checkAuth(Role.AGENT,Role.USER), TransactionController.getMyTransactions)


export const TransactionRoutes = router