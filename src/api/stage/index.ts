import { Router } from "express";
import { StageController } from "./controller";

let router = Router();

router.get("/", StageController.getStage);

export { router };
