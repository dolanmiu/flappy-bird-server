import * as statusRouter from "./api/status";
import { ApplicationWrapper } from "./bootstrap/application-wrapper";
import { IConfig, ProductionConfig } from "./config/index";
// import * as cors from "cors";
import * as logger from "winston";

let config: IConfig = new ProductionConfig();

let appWrapper = new ApplicationWrapper(config);

appWrapper.configure(app => {
    // app.use(cors());
    logger.info("Configuring application routes");
    app.use("/api/status", statusRouter.router);
});

appWrapper.start();

process.on("SIGTERM", () => {
    logger.info("Gracefully terminating");
    process.exit();
});
process.on("uncaughtException", (exception: Error) => {
    logger.error(exception.toString());
    logger.info(`Server stopped because of: ${exception.message}`);
    throw exception;
});
