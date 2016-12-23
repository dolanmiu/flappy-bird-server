import * as controller from "./controller";
import { Router } from "express";

let router = Router();

router.get("/", controller.index);

export { router };
