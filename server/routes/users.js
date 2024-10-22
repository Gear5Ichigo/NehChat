const express = require("express");
const { join } = require("node:path")

const router = express.Router();

router.post("/login", (req, res) => {

});

router.post("/create", (req, res) => {
    res.redirect('/')
});

module.exports = router;