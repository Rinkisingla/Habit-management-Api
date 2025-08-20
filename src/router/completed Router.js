import { Router } from "express";
 import{dashboard, progress, track} from "../controller/completedController.js"
 import verifyjwt from "../middleware/Auth.middleware.js";
 const comRouter = Router();
comRouter.route('/progress/:id').post(verifyjwt, progress);
comRouter.route('/track/:id').get(verifyjwt, track);
comRouter.route('/dashboard').get(verifyjwt, dashboard);
 export  default comRouter;

  