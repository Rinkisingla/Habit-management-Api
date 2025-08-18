import Router from "express"
 import {newhabit, allHabit, deletehabits, gethabit} from "../controller/HabitController.js"
import verifyjwt from "../middleware/Auth.middleware.js";
const habitRouter = Router();

habitRouter.route("/addHabit").post(verifyjwt, newhabit);
habitRouter.route("/allHabits").get(verifyjwt, allHabit);
habitRouter.route("/deleteHabits/:id").delete(verifyjwt, deletehabits);
habitRouter.route("/gethabit").get(verifyjwt,  gethabit);

 export  default habitRouter;