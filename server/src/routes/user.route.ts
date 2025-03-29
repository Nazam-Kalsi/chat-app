import { Router } from "express";
import { userLogin, userRegistration, userLogout, getFriends, getUser, getCurrentUser, updateUser } from "../controller/user.controller.ts";
import { verifyToken } from "../middleware/auth.middleware.ts";
const router = Router();

router.route(`/sign-up`).post(userRegistration);
router.route('/sign-in').post(userLogin);

//secure routes
router.route('/sign-out').get(verifyToken,userLogout);
router.route('/get-friends').get(verifyToken,getFriends);
router.route('/get-user').get(verifyToken,getUser);
router.route('/get-current-user').get(verifyToken,getCurrentUser);
router.route('/update-user').patch(verifyToken,updateUser);

export default router;
