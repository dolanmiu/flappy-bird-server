import { Router } from "express";
import { StageController } from "./controller";

export class StageRouter {
    public router: Router;

    constructor() {
        this.router = Router();

        this.router.get("/", StageController.getStage);
    }
}
