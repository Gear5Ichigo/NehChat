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
const http = require("http");
//
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        
    }, allowEIO3: true
});
const database = require("./database");
const user_collection = database.collection("Users")
//
const session_options = session({
    secret: "tacocat backwards",
    resave: true,
    saveUninitialized: true,
})
function onlyForHandshake(middleware) {
    return (req, res, next) => {
      const isHandshake = req._query.sid === undefined;
      if (isHandshake) {
        middleware(req, res, next);
      } else {
        next();
      }
    };
  }
//
app
    .use(express.static(join(__dirname, "../client/dist")))
    .use(express.urlencoded({extended: true})) // sets up req.body for forms
    .use(cors({
        origin: ["http://localhost:5173"],
        credentials: true
    })) // connect to react
    .use(session_options)
    .use(passport.initialize())
    .use(passport.session())
    .use(passport.authenticate('session'));
//
io.engine.use(onlyForHandshake(session_options));
io.engine.use(onlyForHandshake(passport.session()));
io.engine.use(passport.authenticate('session'));


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
        console.log(req.user)
        res.send({res: true})
    } else {
        res.send({res:false})
    }
})
//
io.engine.on("connection_error", (err) => {
    console.log(err)
})
io.on('connection', (socket) => {

    const req = socket.request

    console.log(req.session)

    socket.on('message', (msg) => {
        io.emit('message', {msg: msg} )
    })
    
    socket.on('disconnect', () => {
        console.log("disconnected")
    })

});

server.listen(8000, () => {
    console.log("listening 8000");
})

