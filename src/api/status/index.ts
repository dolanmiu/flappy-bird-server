import { Router } from "express";
import * as controller from "./controller";

let router = Router();

router.get("/", controller.index);

export { router };
