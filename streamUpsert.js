require('dotenv').config();
const { getStreamData } = require('./util/getStreamData')
const { getStreamList } = require('./util/getStreamList');

// pull list of streamers
getList().catch(err => console.log(err))
async function getList() {
    const streamerList = await getStreamList()
    for (const streamer of streamerList) {
        console.log('streamer in question: \n' + streamer)
        const userID = streamer.user_id
        const userName = streamer.user_name
        const chat = streamer.include_chatters
        const options = {
            "chat": chat
        }
        const twitchUrl = 'https://api.twitch.tv/helix/streams?user_id=' + userID
        const twitchChatUrl = 'https://tmi.twitch.tv/group/user/' + userName + '/chatters'
        const execMongo = await getStreamData(twitchUrl, twitchChatUrl, options).catch(err => console.log(err));
    }
}

module.exports = { getList }
