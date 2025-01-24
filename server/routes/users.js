const express = require("express");
const passport = require("passport")
const { join } = require("node:path")
const fs = require("node:fs")

const database = require("../database");
const users = database.collection("Users")

const router = express.Router();

router.get("/get_user", (req, res) => {
    res.send({user: req.user})
})

router.post("/login", passport.authenticate('local', {
    successRedirect: '/allchat',
    failureRedirect: '/?login_fail=true'
}));

router.post("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) {return next(err)}
        res.redirect('/')
    })
})

router.post("/register", async (req, res) => {
    console.log(req.body)
    const existing = await users.findOne( {username: req.body.username} )
    if (!existing) {
        const new_user = await users.insertOne( {
            username: req.body.username,
            password: req.body.password,
            color: '#000000',
            profile_picture: 'basic.jpg',
            title: '',
            level: 0,
            joined: 'n/a',
            roles: []
        }, {} );
        const u = await users.findOne( {_id: new_user.insertedId} )
        req.login(u, err => {
            if (err) { res.send(err) } else {
                res.redirect('/allchat');
            }
        })
    } else {
        res.redirect('/signup?register_fail=true&reason=user_already_exists')
    }
});

router.post("/update", async (req, res) => {
    const byteCharacters = atob(req.body.blob.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i<byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const img = new Blob([byteArray], {type: req.body.blob.type})
    const extension = req.body.blob.type.substring(req.body.blob.type.indexOf("/")+1);
    console.log(img)
    fs.writeFileSync(join(__dirname, "../../client/src/assets/uploads/profile_pictures/"+`${req.user.username}.`+extension), byteArray)
    const user = await users.findOne( {username: req.user.username} )
    if (user) {
        const r = await users.updateOne({username: user.username, password: user.password},
            {$set: { color: req.body.color, profile_picture: `uploads/profile_pictures/${req.user.username}.`+extension }}, {upsert:true} 
        );
        console.log(r)
        req.user.color = req.body.color;
        req.user.pfp = `uploads/profile_pictures/${req.user.username}.`+extension ;
        res.redirect('/settings?');
    } else {
        res.redirect('/settings?error=true')
    }
})

module.exports = router;