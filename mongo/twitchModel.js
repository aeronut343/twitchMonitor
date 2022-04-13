const { makeModel } = require('./mongo')

const Stream = makeModel(
    'Streams',
    {
        _id: String,
        user_id: String,
        stream_id: String,
        start_time: Number,
        thumbnail_url: String,
        chat_mods: [],
        chat_vips: [],
        chat_viewers: [],
        data: []
        /*
            timestamp: Date,
            type: String,
            streamTitle: String,
            game_id: String,
            viewer_count: Number,
            language: String,
            tag_ids: [],
            is_mature: Boolean,
            chatter_count: Integer
        */

    }
)

const Streamers = makeModel(
    'Streamers',
    {
        _id: String, // user_id + user_name
        user_id: String,
        user_name: String,
        broadcaster_type: String,
        description: String,
        include_chatters: Boolean
    }
)

module.exports = { Stream, Streamers }