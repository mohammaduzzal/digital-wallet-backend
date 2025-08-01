import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router()

router.post("/register", validateRequest(createUserZodSchema), UserController.createUser)

router.get("/all-users",checkAuth(Role.ADMIN), UserController.getAllUser)
router.get("/me",checkAuth(...Object.values(Role)),UserController.getMe);

router.get("/:id",checkAuth(Role.ADMIN),UserController.getSingleUser);

router.patch("/:id",checkAuth(...Object.values(Role)),validateRequest(updateUserZodSchema), UserController.updateUser)

export const UserRoutes = router