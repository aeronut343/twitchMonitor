require('dotenv').config();
const mongoose = require('mongoose');
const { connect } = require('../mongo/mongo');
const axios = require('axios');
const { Stream } = require('../mongo/twitchModel');
const { twitchTokenRefresh } = require('./twitchTokenRefresh')

// call env vars
const password = process.env.MONGOPWD;
var twitchToken = process.env.TWITCHTOKEN;
const twitchClientId = process.env.TWITCHCLIENTID;

// TODO: Call the auto-refresh function at the start? Not sure if refreshing once per minute would be too much
async function getStreamData(twitchUrl, twitchChatUrl, options = null) {
    // Initialize variables
    let _id = ""
    let chatData = {}

    // check for get chatters option
    if (options?.chat === true) {
        console.log('chat true')
        // Get twitch chat data
        await axios
            .get(twitchChatUrl, {
                headers: {
                    'Authorization': twitchToken,
                    'Client-Id': twitchClientId
                }
            })
            .then(function (res) {
                // if "error" in body then deal with it
                if (res.data.error === "Unauthorized") {
                    // refresh access token
                    console.log('invalid access token!\n Generating new one...\n')
                    return twitchTokenRefresh()
                }
                chatData = res.data
            })

    } else {
        console.log('chat false')
        chatData = {
            "chatters": {
                "moderators": [],
                "vips": [],
                "viewers": []
            }
        }
    }

    // Get twitch stream data
    await connect()
    await axios
        .get(twitchUrl, {
            headers: {
                'Authorization': twitchToken,
                'Client-Id': twitchClientId
            }
        })
        .then(function (res) {
            // if "error" in body then deal with it
            if (res.data.error === "Unauthorized") {
                // refresh access token
                console.log('invalid access token!\n Generating new one...\n')
                return twitchTokenRefresh()
            }
            // if there is stream data, store it
            if (res.data.data[0]) {
                console.log('data found\n')
                // parse data into a dict
                const info = res.data.data[0]

                // combine data into insertable form
                _id = info.user_id + info.id

                // currentTime = new Date(Date.now()).toISOString()
                let currentTime = new Date(Date.now())
                currentTime = Date.parse(currentTime)  // Use Unix for easier queries
                let startTime = Date.parse(info.started_at)

                // begin upsert
                console.log('upserting data')
                return Stream.updateOne({ "_id": _id }, {
                    "$push": {
                        "data": {
                            "timeUnix": currentTime,
                            "type": info.type,
                            "streamTitle": info.title,
                            "game_id": info.game_id,
                            "viewer_count": info.viewer_count,
                            "language": info.language,
                            "tag_ids": info.tag_ids,
                            "is_mature": info.is_mature,
                            "chatter_count": chatData.chatter_count
                        }
                    },
                    "$setOnInsert": {
                        "_id": _id,
                        "user_id": info.user_id,
                        "stream_id": info.id,
                        "start_time": startTime,
                        "thumbnail_url": info.thumbnail_url,
                        "chat_mods": chatData.chatters.moderators,
                        "chat_vips": chatData.chatters.vips,
                        "chat_viewers": chatData.chatters.viewers
                    }
                },
                    { upsert: true })
            } else {
                console.log('No data, skipping...\n')
            }
        })
        .then(function () {
            // check for chat data
            if (options?.chat === true) {
                console.log('updating chat lists...')
                return Stream.updateOne({ "_id": _id }, {
                    "$addToSet": {
                        "chat_mods": { "$each": chatData.chatters.moderators },
                        "chat_vips": { "$each": chatData.chatters.vips },
                        "chat_viewers": { "$each": chatData.chatters.viewers }
                    }
                })
            }

        })
        .catch(function (error) {
            console.log(error)
        })
    mongoose.connection.close()
}

module.exports = { getStreamData }