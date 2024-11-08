const db = require('database')
async function run() {
    const users = db.collection('Users')
    const r = await users.updateMany({}, {$set: {profile_picture: "basic.jpg"}, color: "#000000" })
}
run()