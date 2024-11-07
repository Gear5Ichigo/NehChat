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
//
const { Server } = require("socket.io");
const { join } = require("node:path")
const fs = require("node:fs")
const http = require("http");
//
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        
    }, allowEIO3: true, maxHttpBufferSize: 8e8
});
const database = require("./database");
const user_collection = database.collection("Users")
const profanity = new Profanity({
    languages: ['en', 'fr', 'es', 'de'],
    wholeWord: true,
    grawlix: "[censored]"
});
profanity.addWords(["sigma", "skibidi", "ohio", "rizz", "goon"])
profanity.removeWords(["balls"])
//
const session_options = session({
    secret: "tacocat backwards",
    resave: false,
    saveUninitialized: false,
})
//
app
    .use(express.static(join(__dirname, "uploads/chat")))
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
io.engine.use(session_options);
io.engine.use(passport.session());
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
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.send({res: true})
    } else {
        res.send({res: false})
    }
})
//
let userstyping = []
let allusers = []
io.engine.on("connection_error", (err) => {
    console.log(err)
})
io.on('connection', (socket) => {

    const req = socket.request

    console.log(req.session)
    if (req.user) {
        allusers.push(req.user)
        io.emit('user connected', req.user, allusers)
        console.log(socket.id);
        io.to(socket.id).emit('client connect', req.user);
    }

    socket.on('message', data => {
        let upload = null
        if (data.fileItem) {
            console.log(data.fileItem)
            data.fileItem.name = `${req.user.username}-${data.fileItem.name}`
            fs.readdir(join(__dirname, "../client/src/assets/uploads/"), (err, files) => {
                if (err) {
                    console.log(err);
                } else {
                    fs.writeFileSync(join(__dirname, "../client/src/assets/uploads/"+data.fileItem.name), data.fileItem.data, err => {
                        if (err) console.log(err);
                    })
                }
            });
            upload = {name: data.fileItem.name, type: data.fileItem.type}
        }

        const atSymbol = data.message.indexOf('@')
        const endOfName = data.message.indexOf(' ', atSymbol) != -1 ? data.message.indexOf(' ', atSymbol) : data.message.length;
        const isUser = allusers.find(user => user.username == data.message.substring(atSymbol+1, endOfName));
        const targetuser = isUser != undefined ? isUser : {username: '?'};

        console.log("USER_: "+targetuser.username);
        console.log(data.fileItem);

        const dateTime = new Date(data.date)

        io.emit('message', {
            user: req.user,
            message: profanity.censor(data.message),
            upload: upload,
            pingUsers: targetuser,
            dateTime: {
                total: dateTime.getTime(),
                month: dateTime.getMonth(),
                day: dateTime.getDate(),
                year: dateTime.getFullYear(),
                hour: dateTime.getHours(),
                minute: dateTime.getMinutes(),
                second: dateTime.getSeconds(),
            }
        });
    })

    socket.on('admin censor', (index) => {
        io.emit('admin censor', index);
    })
    
    socket.on('user typing', () => {
        
        if (userstyping.indexOf(req.user)==-1) {
            userstyping.push(req.user)
            io.emit('user typing', userstyping);
        }
    })
    socket.on('user not typing', () => {
        if (userstyping.includes(req.user)) {
            userstyping.splice(userstyping.indexOf(req.user), 1);
            io.emit('user typing', userstyping);
        }
    })

    socket.on('disconnect', () => {
        console.log("disconnected");
        if (userstyping.includes(req.user)) {
            userstyping.splice(userstyping.indexOf(req.user), 1);
            io.emit('user typing', userstyping);
        }
        socket.emit('user tpying');
    })

});

server.listen(8000, () => {
    console.log("listening 8000");
})

