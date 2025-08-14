import Router from "express"
 import {userRegister, loginUser} from "../controller/UserController.js"
const userRouter = Router();

userRouter.route("/userRegister").post(userRegister);
userRouter.route("/loginUser").post(loginUser);

 export  default userRouter;