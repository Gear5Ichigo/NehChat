const express = require("express");
const cors = require("cors");
//
const { Strategy } = require("passport-local");
const session = require("express-session");
const logger = require("morgan")
const passport = require("passport");
const crypto = require("crypto");
//
const users = require("./routes/users")
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
app.use("/api/users", users)
//
app.use(express.static(join(__dirname, "../client/dist")));
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
app.get("/api/theme", (req, res) => {
    const theme = req.query.theme === "light" ? "dark" : "light" 
    res.send({theme: theme})
})
//
io.on('connection', (socket) => {
    socket.on('message', () => {

    })
});

app.listen(8080, () => {
    console.log("listening 8080");
})