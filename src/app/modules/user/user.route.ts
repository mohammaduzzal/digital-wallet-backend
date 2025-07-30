import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { UserController } from "./user.controller";

const router = Router()

router.post("/register", validateRequest(createUserZodSchema), UserController.createUser)

router.get("/all-users", UserController.getAllUser)

router.patch("/:id",validateRequest(updateUserZodSchema), UserController.updateUser)

export const UserRoutes = router