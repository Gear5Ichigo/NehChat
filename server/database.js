const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://nenreh:mongoneh@schoolstuff.gjla1uc.mongodb.net/?retryWrites=true&w=majority&appName=SchoolStuff");
const database = client.db("SocketIO")

module.exports = database