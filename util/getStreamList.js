require('dotenv').config();
const mongoose = require('mongoose');
const { connect } = require('../mongo/mongo');
const { Streamers } = require('../mongo/twitchModel');

getStreamList().catch(err => console.log(err))
async function getStreamList() {
    // connect to mongo, find stream list
    connect()
    const List = await Streamers.find({}).exec()
    return List
}

module.exports = { getStreamList }