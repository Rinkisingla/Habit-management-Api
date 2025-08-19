import { Router } from "express";
 import{progress, track} from "../controller/completedController.js"
 import verifyjwt from "../middleware/Auth.middleware.js";
 const comRouter = Router();
comRouter.route('/progress/:id').post(verifyjwt, progress);
comRouter.route('/track/:id').get(verifyjwt, track);
 export  default comRouter;

  