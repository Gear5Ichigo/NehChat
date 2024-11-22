const express = require('express');
//
const router = express.Router();
const database = require('../database');
const highscores = database.collection('Highscores')
//

router.post('/2048_score_submit', async (req, res) => {
    let score_list = await highscores.findOne({game: "2048"});
    if (score_list) {
        score_list.scores[req.user.username] = req.body.score;
        highscores.updateOne({game: "2048"}, {$set: score_list })
        res.send(score_list);
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