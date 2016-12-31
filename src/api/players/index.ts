import { Request, Response, Router } from "express";
import { SocketIOManager } from "../../bootstrap/socket-io-wrapper";
// import { PlayerController } from "./controller";

export class PlayerRouter {
    public router: Router;

    constructor(socketIOManager: SocketIOManager) {
        this.router = Router();

        this.router.get("/", (req: Request, res: Response) => {
            res.status(200).json(socketIOManager.currentPlayers);
        });

        this.router.get("/stats", (req: Request, res: Response) => {
            res.status(200).json({
                count: socketIOManager.currentPlayers.length,
            });
        });
    }
}
