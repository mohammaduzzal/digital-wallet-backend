import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createContactValidation } from "./contact.validation";
import { contactController } from "./contact.controller";

const router = Router()

router.post("/post", validateRequest(createContactValidation),contactController.createPost)



export const ContactRoutes = router