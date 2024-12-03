const express = require('express');
//
const router = express.Router();
const database = require('../database');
const highscores = database.collection('Highscores')
//

router.post('/2048_score_submit', async (req, res) => {
    if (!req.user) return;

    const userscore = await highscores.findOne({username: req.user.username, game:"2048"});

    const previousscore = userscore ? userscore.score : 0
    const newscore = req.body.score > previousscore ? req.body.score : previousscore

    console.log(userscore)

    if (userscore) {
        await highscores.updateOne( {username: req.user.username, game: "2048"} , {$set:{score: newscore}}, {upsert: true})
    } else {
        await highscores.insertOne({
            username: req.user.username,
            game: "2048",
            score: newscore,
        })
    }

    const scorearray = await highscores.find({game:"2048"}).toArray();
    let allscores = []
    for (const index in scorearray) {
        const element = scorearray[index];
        allscores.push([element.username, element.score]);
    }
    allscores.sort((a, b) => { return b[1] - a[1] });

    res.send(allscores)
})

router.post('/midnight_motorist_score_submit', async (req, res) => {

});

//
module.exports = router;