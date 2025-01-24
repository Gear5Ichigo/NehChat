const { Socket, Server, Namespace } = require("socket.io");
const { join } = require("node:path")
const fs = require("node:fs")
/**
 * @param {Request} req
 * @param {Server} io 
 * @param {Socket} socket 
 * @param {Namespace} namespace
 */
module.exports = async (io, options = {}) => {

    let userstyping = [];
    let mutedusers = [];
    let allusers = [];
    let allmessages = [];

    const namespace = io.of("/allchat")

    function addMessage(msg) {
        if (allmessages.length >= (2**8) ) allmessages.splice(0, 1);
        allmessages.push(msg)
    }

    namespace.on("connection", socket => {

        const req = socket.request;

        //===============

        if (req.user) {
            allusers.push([req.user, socket.id]);
            namespace.emit('user connected', allmessages, allusers);
            console.log(socket.id);
            namespace.to(socket.id).emit('client connect', req.user);
            if (mutedusers.find((u => u.username===req.user.username))) {
                namespace.to(socket.id).emit('set mute', true);
            }
        }

        socket.on('disconnect', () => {
            console.log("disconnected");
            allusers.splice(allusers.indexOf(req.user), 1);
            namespace.emit('user disconnected', allusers);
            if (userstyping.includes(req.user)) {
                userstyping.splice(userstyping.indexOf(req.user), 1);
                namespace.emit('user typing', userstyping);
            }
            socket.emit('user tpying');
        })

        //===================
    
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
                        }, 240*1000) // seconds * 1000 which converts it to ms
                    }
                });
                upload = {name: data.fileItem.name, type: data.fileItem.type}
            }

            const atSymbol = data.message.indexOf('@')
            let targetuser = {username: "?"}
            if (atSymbol!=-1) {
                allusers.find((item) => {
                    console.log(item[0].username)
                })
                const endOfName = data.message.indexOf(' ', atSymbol) != -1 ? data.message.indexOf(' ', atSymbol) : data.message.length;
                const isUser = allusers.find(user => user[0].username === data.message.substring(atSymbol+1, endOfName));
                targetuser = isUser != undefined ? isUser : {username: '?'};
            }

            console.log("USER_: "+targetuser.username), data.fileItem;

            const dateTime = new Date(data.date)

            const processedMessage = {
                user: req.user,
                message: options.profanity.censor(data.message),
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

            namespace.emit('message', allmessages);
        })
        
        //====
    
        socket.on('delete message', (index) => {
            allmessages.splice(parseInt(index), 1);
            namespace.emit('update messages', allmessages);
        })
    
        socket.on('admin censor', (index) => {
            const message = allmessages[parseInt(index)];
            message.message = message.message? "[This message was censored by the State]" : message.message;
            if (message.upload) {
                message.upload = {name: 'shaq_time_out.jpg', type: 'images/jpeg'}
                message.message = message.message? message.message : "[The previous image is not allowed by the State]" ;
            }
            namespace.emit('update messages', allmessages);
        })
        
        socket.on('admin mute', (username) => {
            const targetUser = allusers.find((item, index) => {
                if (item[0].username===username) {
                    return allusers[index];
                }
            });
            if (targetUser==null || !mutedusers.find(item => item.name === targetUser.name)) {
                mutedusers.push(targetUser[0]);
                namespace.to(targetUser[1]).emit('set mute', true);
            } else {
                mutedusers.splice(mutedusers.indexOf(targetUser[0]), 1);
                namespace.to(targetUser[1]).emit('set mute', false);
            }
        })
    
        socket.on('user typing', () => {
            if (userstyping.indexOf(req.user)==-1) {
                userstyping.push(req.user)
                namespace.emit('user typing', userstyping);
            }
        })
        socket.on('user not typing', () => {
            if (userstyping.includes(req.user)) {
                userstyping.splice(userstyping.indexOf(req.user), 1);
                namespace.emit('user typing', userstyping);
            }
        })

        //
    });
}