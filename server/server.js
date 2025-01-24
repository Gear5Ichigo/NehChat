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
const fs = require("node:fs")
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

// routes **always go after app.use
app.use("/api/users", users);
app.use("/api/games", games);
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
let userstyping = []
let mutedusers = []
let allusers = []
let allmessages = []
function addMessage(msg) {
    if (allmessages.length >= (2**8) ) allmessages.splice(0, 1);
    allmessages.push(msg)
}
io.engine.on("connection_error", (err) => {
    console.log(err)
})
io.on('connection', (socket) => {

    const req = socket.request

    socket.on('midnight motorist', () => {
        console.log("MIDNIGHT MOTORIST CONNECTED")
    })

    console.log(req.session)
    if (req.user) {
        allusers.push(req.user);
        addMessage({
            user: {
                username: "Goku Server (real)",
                color: '#42f5ef',
                pfp: '1cb.jpg',
            },
            message: `${req.user.username} joined... yippeee!`,
            dateTime: {
                month: 0, year: 0, day: 0, hour: 0, minute: 0, second: 0,
            }
        })
        io.emit('user connected', allmessages, allusers)
        console.log(socket.id);
        io.to(socket.id).emit('client connect', req.user);
    }

    socket.on('message', data => {
        if (!req.user) {
            socket.emit('redirect'); return;
        }
        let upload = null
        if (data.fileItem) {
            console.log(req.user, data.fileItem)
            data.fileItem.name = `${req.user.username}-${data.fileItem.name}`
            fs.readdir(join(__dirname, "../client/src/assets/uploads/"), (err, files) => {
                if (err) {
                    console.log(err);
                } else {
                    const dir = "../client/src/assets/uploads/chat/"+data.fileItem.name
                    fs.writeFileSync(join(__dirname, dir), data.fileItem.data, err => {
                        if (err) console.log(err);
                    })
                    setTimeout(()=>{
                        fs.unlink(dir, (err)=>{
                            if (err) console.log(err);
                            console.log("timeout reached, file deleted")
                        })
                    }, 300*1000) // seconds * 1000 which converts it to ms
                }
            });
            upload = {name: data.fileItem.name, type: data.fileItem.type}
        }

        const atSymbol = data.message.indexOf('@')
        let targetuser = {username: "?"}
        if (atSymbol!=-1) {
            const endOfName = data.message.indexOf(' ', atSymbol) != -1 ? data.message.indexOf(' ', atSymbol) : data.message.length;
            const isUser = allusers.find(user => user.username == data.message.substring(atSymbol+1, endOfName));
            targetuser = isUser != undefined ? isUser : {username: '?'};
        }

        console.log("USER_: "+targetuser.username), data.fileItem;

        const dateTime = new Date(data.date)

        const processedMessage = {
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
        }

        addMessage(processedMessage)

        io.emit('message', allmessages);
    })

    socket.on('delete message', (index) => {
        allmessages.splice(parseInt(index), 1);
        io.emit('update messages', allmessages);
    })

    socket.on('admin censor', (index) => {
        const message = allmessages[parseInt(index)];
        message.message = message.message? "[This message was censored by the State]" : message.message;
        if (message.upload) {
            message.upload = {name: 'shaq_time_out.jpg', type: 'images/jpeg'}
            message.message = message.message? message.message : "[The previous image is not allowed by the State]" ;
        }
        io.emit('update messages', allmessages);
    })
    
    socket.on('admin mute', () => {
        
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

