const express = require("express");
const cors = require("cors");
//
const { Strategy } = require("passport-local");
const session = require("express-session");
const logger = require("morgan");
const passport = require("passport");
const crypto = require("crypto");
const { Profanity, CensorType } = require("@2toad/profanity");
//
const users = require("./routes/users");
const games = require("./routes/games");
//
const { Server } = require("socket.io");
const { join } = require("node:path")
const http = require("http");
//
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }, allowEIO3: true, maxHttpBufferSize: 8e8
});

//
//===
const database = require("./database");
const user_collection = database.collection("Users")

//
//====
const profanity = new Profanity({
    languages: ['en', 'fr', 'es', 'de'],
    wholeWord: true,
    grawlix: "[censored]"
});
profanity.addWords(["sigma", "skibidi", "ohio", "rizz", "goon"])
profanity.removeWords(["balls"])

//
//==============
const session_options = session({
    secret: "tacocat backwards",
    resave: false,
    saveUninitialized: false,
})

app
    .use(express.static(join(__dirname, "uploads/chat")))
    .use(express.json())
    .use(express.urlencoded({extended: true})) // sets up req.body for forms
    .use(cors({
        origin: ["http://localhost:3000"],
        credentials: true
    })) // connect to react
    .use(session_options)
    .use(passport.initialize())
    .use(passport.session())
    .use(passport.authenticate('session'));

io.engine.use(session_options);
io.engine.use(passport.session());
io.engine.use(passport.authenticate('session'));

//
//==

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
            color: user.color,
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

//
//============= routes **always go after app.use

app.use("/api/users", users);
app.use("/api/games", games);

//
//=================================api things

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
//===============================Socket.io

const allchat = require("./sockets/allchat");
const pizzaSockets = require("./sockets/pizza");

io.engine.on("connection_error", (err) => {
    console.log(err)
})

allchat(io, {
    profanity: profanity,
});

pizzaSockets(io, {
    
})

//
//=====

server.listen(8000, () => {
    console.log("listening 8000");
})

