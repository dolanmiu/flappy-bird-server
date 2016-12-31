import * as http from "http";
import * as socketIo from "socket.io";
import * as logger from "winston";

interface IPlayer {
    id: string;
    name: string;
}

export class SocketIOManager {
    private io: SocketIO.Server;

    constructor(private server: http.Server) {
        this.io = socketIo.listen(this.server);
    }

    public start(): void {
        this.io.on("connection", (socket) => {
            socket.handshake.query.name = socket.handshake.query.name ? socket.handshake.query.name : "Un-named";

            socket.broadcast.emit("new-player", {
                id: socket.id,
                name: socket.handshake.query.name,
            });

            logger.info(`User ${socket.client.id} connected. With name: ${socket.handshake.query.name}`);

            socket.on("disconnect", (data: string) => {
                logger.info(`User ${socket.client.id} disconnected. Destroying all services assigned to this user`);
            });

            socket.on("jump", () => {
                logger.debug(`User ${socket.client.id} jumped.`);
            });

            socket.on("position", (position: { x: number, y: number }) => {
                socket.broadcast.emit("position", {
                    id: socket.id,
                    x: position.x,
                    y: position.y,
                });
            });
        });
    }

    public get currentPlayers(): Array<IPlayer> {
        let players = new Array<IPlayer>();
        let sockets = this.io.sockets.sockets;

        for (let socketId of Object.keys(sockets)) {
            let socket = sockets[socketId];

            players.push({
                id: socket.id,
                name: socket.handshake.query.name,
            });
        }

        return players;
    }
}
