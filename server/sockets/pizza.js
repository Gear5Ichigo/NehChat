const { Server } = require("socket.io")

/**
 * @param {Request} socket
 * @param {Server} io 
 */
module.exports = async (io, options) => {

    const namespace = io.of('/pizza');
    
    const rooms = []

    namespace.on("connection", socket => {

        console.log("someone joined pizza");

        const req = socket.request;
        const session = req.session;

        // Room stuff
        //=======================================

        socket.on("disconnect", () => {
            console.log("Disconnected from Pizza")
        });

        socket.on("create room", (roomCode) => {
            if (socket.rooms.size < 1) {
                rooms.push(roomCode);
                socket.join(roomCode);
            }
        });

        socket.on("disband room", (roomCode) => {
            namespace.socketsLeave(roomCode)
        });

        socket.on("join room", (roomCode) => {

        })

        socket.on("leave room", () => {

        })

        socket.on("start game", (roomCode) => {
            namespace.to(roomCode).emit("start game");
        })
        
        //

        // Player Synchronization / Events
        //=====================================

        socket.on("player movement", () => {

        })

        //

    })
}