const axios = require("axios");
const cors = require('micro-cors')()

const handler = (req, res) => {

    const code = req.body.code

    const clientId = '2a402e657970a7da677c'
    const cleintSecret = '9679f79aa1dec599e8d8f9e1076870ea6d162e0f'

    axios.post('https://github.com/login/oauth/access_token', {
        client_id: clientId,
        client_secret: cleintSecret,
        code: code
    })
    .then(accessToken => {
        res.status(200).send({
            tokenData: accessToken 
        })
    })
    .catch(err => {
        res.status(400).send('Authentication Failed')
    })
}

module.exports = cors(handler)