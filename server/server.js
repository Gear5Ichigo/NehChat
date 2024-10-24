const express = require("express");
const cors = require("cors");
//
const { Strategy } = require("passport-local");
const session = require("express-session");
const logger = require("morgan");
const passport = require("passport");
const crypto = require("crypto");
//
const users = require("./routes/users");
//
const { Server } = require("socket.io");
const { join } = require("node:path")
const { createServer } = require("node:http");
//
const app = express();
const server = createServer(app);
const io = new Server(server);
const database = require("./database");
const user_collection = database.collection("Users")
//

//
app.use(express.static(join(__dirname, "../client/dist")));
app.use(express.urlencoded({extended: true})); // sets up req.body for forms
app.use(cors({
    origin: ["http://localhost:5173"],
})); // connect to react
//
passport.use(new Strategy(async function verify(username, password, cb) {
    const user_result = await user_collection.findOne( {username: username} )
    if (user_result!=null) {
        if (user_result.password===password) {
            cb(null, user_result);
        } else cb(null, false, {message: 'Incorrect Password'});
    } else cb(null, false, {message: "User does not exist"});
}))
passport.serializeUser( (user, cb) => {
    process.nextTick( () => {
        cb(null, {
            username: user.username,
            pfp: user.profile_picture,
            title: user.title,
            roles: user.roles
        } );
    });
});
passport.deserializeUser( (user, cb) => {
    process.nextTick( () => {
        cb(null, user);
    });
})
app.use(session({
    secret: "tacocat backwards",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'))
//

// routes **always go after app.use
app.use("/api/users", users)
//

//
app.get("/api/theme", (req, res) => {
    const theme = req.query.theme === "light" ? "dark" : "light" 
    res.send({theme: theme})
})
app.get("/api/authenticate", (req, res, next) => {
    if (req.isAuthenticated()) {
        res.send({res: true})
    } else {
        res.send({res: false})
    }
})
//
io.on('connection', (socket) => {
    socket.on('message', () => {

    })
});

app.listen(8080, () => {
    console.log("listening 8080");
})