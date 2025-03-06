import { Router } from "express";
import { userLogin, userRegistration, userLogout } from "../controller/user.controller.ts";
import { verifyToken } from "../middleware/auth.middleware.ts";
const router = Router();

router.route(`/sign-up`).post(userRegistration);
router.route('/sign-in').post(userLogin);

//secure routes
router.route('/sign-out').get(verifyToken,userLogout);

export default router;
