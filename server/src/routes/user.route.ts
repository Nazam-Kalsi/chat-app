import { Router } from "express";
import { userLogin, userRegistration, userLogout, googleSignUp, getFriends, getUser, getCurrentUser, updateUser, checkUniqueUserName } from "../controller/user.controller.ts";
import { verifyToken } from "../middleware/auth.middleware.ts";
import { upload } from "../middleware/multer.middleware.ts";
const router = Router();

router.route(`/check-userName`).post(checkUniqueUserName);
router.route(`/sign-up`).post(upload.single("avatar"),userRegistration);
router.route(`/google-sign-up`).post(googleSignUp);
router.route('/sign-in').post(userLogin);

//secure routes
router.route('/sign-out').get(verifyToken,userLogout);
router.route('/get-friends').get(verifyToken,getFriends);
router.route('/get-user').get(verifyToken,getUser);
router.route('/get-current-user').get(verifyToken,getCurrentUser);
router.route('/update-user').patch(verifyToken,updateUser);

export default router;
