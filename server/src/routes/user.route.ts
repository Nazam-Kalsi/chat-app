import { Router } from "express";
import { userLogin, userRegistration } from "../controller/user.controller.ts";
const router = Router();

router.route(`/sign-up`).post(userRegistration);
router.route('/sign-in').post(userLogin);

export default router;
