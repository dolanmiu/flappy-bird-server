import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as http from "http";
import * as morgan from "morgan";
import * as logger from "winston";

import { IConfig } from "../config";

export class ApplicationWrapper {
    private app: express.Application;
    private server: http.Server;

    constructor(private config: IConfig) {
        this.app = express();

        this.app.use(compression());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        this.app.use(morgan("dev"));
        // this.app.use(express.static(this.app.get("appPath")));

        this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (err) {
                logger.error(err.message);
                logger.error(err.stack);
            }
        });

        this.server = http.createServer(this.app);
    }

    public start(callback: () => void = () => null): void {
        this.server.listen(this.config.port, () => {
            logger.info(`Express server listening on ${this.config.port}, in ${process.env.NODE_ENV} mode`);
            callback();
        });
    }

    public configure(func: (app: express.Application) => void = () => null): void {
        func(this.app);
    }

    get Server(): http.Server {
        return this.server;
    }
}
