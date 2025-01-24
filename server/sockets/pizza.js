const { Server } = require("socket.io")

/**
 * @param {Request} socket
 * @param {Server} io 
 */
module.exports = async (io, options) => {

    const namespace = io.of('/pizza');

    namespace.on("connection", socket => {

        console.log("someone joined pizza");

        // Room stuff
        //=======================================

        socket.on("disconnect", () => {
            console.log("Disconnected from Pizza")
        });

        socket.on("create room", () => {

        });

        socket.on("disband room", () => {

        });

        socket.on("join room", () => {

        })

        socket.on("leave room", () => {

        })
        
        //

        // Player Synchronization / Events
        //=====================================

        socket.on("player movement", () => {

        })

        //

    })
}