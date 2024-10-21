const express = require("express");
const cors = require("cors");
//
const { Strategy } = require("passport-local");
const session = require("express-session");
const logger = require("morgan")
const passport = require("passport");
const crypto = require("crypto");
//
const users = require("./users")
//
const { Server } = require("socket.io");
const { join } = require("node:path")
const { createServer } = require("node:http");
//
const app = express();
const server = createServer(app)
const io = new Server(server);
//
// routes
app.use("/users", users)
//
app.use(express.static(join(__dirname, "../client/build")));
//
app.use(cors({
    origin: ["http://localhost:5173"],
}));
app.use(session({
    secret: "tacocat backwards",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.authenticate('session'))
//

app.post("/api/post", (req, res) => {
    console.log("reacting");
    res.redirect("/")
})

io.on('connection', (socket) => {
    socket.on('message', () => {

    })
});

app.listen(8080, () => {
    console.log("listening 8080");
})