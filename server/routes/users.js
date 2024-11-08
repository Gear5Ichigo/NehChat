const express = require("express");
const passport = require("passport")
const { join } = require("node:path")

const database = require("../database");
const users = database.collection("Users")

const router = express.Router();

router.get("/get_user", (req, res) => {
    res.send({user: req.user})
})

router.post("/login", passport.authenticate('local', {
    successRedirect: '/dashboard',
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
                res.redirect('/dashboard');
            }
        })
    } else {
        res.redirect('/signup?register_fail=true&reason=user_already_exists')
    }
});

router.post("/update", async (req, res) => {
    console.log(req.body.color)
    const user = await users.findOne( {username: req.body.username} )
    if (user) {
        users.updateOne({username: user.username},
            {$set: {color: req.body.color}}
        );
        req.user.color = req.body.color
        res.redirect('/settings?')
    } else {
        res.redirect('/settings?error=true')
    }
})

module.exports = router;