const express = require("express");
const passport = require("passport")
const { join } = require("node:path")

const database = require("../database");
const users = database.collection("Users")

const router = express.Router();

router.post("/login", passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
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
            profile_picture: 'basic.png',
            title: '',
            level: 0,
            joined: 'n/a',
            roles: []
        }, {} );
        const u = await users.findOne( {_id: new_user.insertedId} )
        req.login(u, err => {
            if (err) { res.send(err) } else {
                res.redirect('/dashboard');
            }
        })
    } else {
        res.redirect('/signup')
    }
});

module.exports = router;