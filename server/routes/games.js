const express = require('express');
//
const router = express.Router();
const database = require('../database');
const highscores = database.collection('Highscores')
//

router.post('/2048_score_submit', async (req, res) => {
    if (!req.user) return;
    let score_list = await highscores.findOne({game: "2048"});
    if (score_list) {
        const newscore = score_list.scores[req.user.username] > req.body.score ? score_list.scores[req.user.username] : req.body.score
        score_list.scores[req.user.username] = newscore
        highscores.updateOne({game: "2048"}, { $set : { [`scores.${req.user.username}`] : newscore } }, {upsert: true})

        let mappedscores = [];
        for (const key in score_list.scores) {
            mappedscores.push( [key, score_list.scores[key]] );
        }
        mappedscores.sort( (a, b) => b[1] - a[1] );

        res.send(mappedscores);
    } else {
        const updated_score = JSON.parse(`{"${req.user.username}": ${req.body.score}}`)
        await highscores.insertOne({
            game: "2048",
            scores: updated_score
        })
        res.send(updated_score)
    }
})

router.post('midnight_motorist_score_submit', async (req, res) => {

});

//
module.exports = router;