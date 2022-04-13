require('dotenv').config()
const axios = require('axios')
const fs = require('fs')
async function twitchTokenRefresh() {
    CLIENT_ID = process.env.CLIENT_ID
    CLIENT_SECRET = process.env.CLIENT_SECRET
    url = " https://id.twitch.tv/oauth2/token?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&grant_type=client_credentials"
    await axios
        .post(url)
        .then(function (res) {
            fs.readFile("./.env", 'utf8', (err, data) => {
                if (err) {
                    return console.log(error)
                }
                var result = data.replace(process.env.TWITCHTOKEN, "Bearer " + res.data.access_token)
                fs.writeFile("./.env", result, 'utf8', function (err) {
                    if (err) {
                        return console.log(error)
                    }
                })
            })
            console.log("new access token generated.")
        })
        .catch(function (error) {
            console.log(error)
        })
}

module.exports = { twitchTokenRefresh }
