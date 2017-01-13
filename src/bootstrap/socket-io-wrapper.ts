import * as escape from "escape-html";
import * as http from "http";
import * as socketIo from "socket.io";
import * as logger from "winston";

interface IPlayer {
    id: string;
    name: string;
    color: number;
}

export class SocketIOManager {
    private io: SocketIO.Server;

    constructor(private server: http.Server) {
        this.io = socketIo.listen(this.server);
    }

    public start(): void {
        this.io.on("connection", (socket) => {
            logger.info(`User ${socket.id} connected. With name: ${socket.handshake.query.name}`);

            socket.handshake.query.name = socket.handshake.query.name ? socket.handshake.query.name.substring(0, 30) : "Un-named";

            this.sendChatMessage(`User ${socket.handshake.query.name} connected.`, "Announcement");

            socket.broadcast.emit("new-player", {
                color: socket.handshake.query.color,
                id: socket.id,
                name: socket.handshake.query.name,
            });

            socket.on("disconnect", (data: string) => {
                logger.info(`User ${socket.id} disconnected.`);
                socket.broadcast.emit("disconnected", {
                    id: socket.id,
                });
                this.sendChatMessage(`User ${socket.handshake.query.name} disconnected.`, "Announcement");
            });

            socket.on("jump", () => {
                logger.debug(`User ${socket.id} jumped.`);
                socket.broadcast.emit("jump", {
                    id: socket.id,
                });
            });

            socket.on("death", () => {
                logger.debug(`User ${socket.id} died.`);
                socket.broadcast.emit("death", {
                    id: socket.id,
                });
            });

            socket.on("position", (position: { x: number, y: number, angle: number }) => {
                socket.broadcast.emit("position", {
                    angle: position.angle,
                    id: socket.id,
                    x: position.x,
                    y: position.y,
                });
            });

            socket.on("chat-message", (message: string) => {
                logger.debug(`User ${socket.id} sent message. ${message}`);
                this.sendChatMessage(message, socket.handshake.query.name);
            });
        });
    }

    public get currentPlayers(): Array<IPlayer> {
        let players = new Array<IPlayer>();
        let sockets = this.io.sockets.sockets;

        for (let socketId of Object.keys(sockets)) {
            let socket = sockets[socketId];

            players.push({
                color: socket.handshake.query.color,
                id: socket.id,
                name: socket.handshake.query.name,
            });
        }

        return players;
    }

    private sendChatMessage(message: string, name: string): void {
        this.io.emit("chat-message", {
            message: escape(message),
            name: escape(name),
        });
    }
}
