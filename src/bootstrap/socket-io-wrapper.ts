import * as http from "http";
import * as socketIo from "socket.io";
import * as logger from "winston";

export class SocketIOManager {
    private io: SocketIO.Server;

    constructor(private server: http.Server) {
        this.io = socketIo.listen(this.server);
    }

    public start(): void {
        this.io.on("connection", (socket) => {
            logger.info(`User ${socket.client.id} connected.`);

            socket.on("disconnect", (data: string) => {
                logger.info(`User ${socket.client.id} disconnected. Destroying all services assigned to this user`);
            });

        });
    }
}
