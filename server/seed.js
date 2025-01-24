import database from "./database.js";
async function run() {
    // const users = db.collection('Users')
    // const r = await users.updateMany({}, {$set: {profile_picture: "basic.jpg"}, color: "#000000" })

    database.collection('Highscores').deleteMany({}); // deletes all highscores
}
run();
process.exit();