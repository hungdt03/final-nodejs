const crypto = require('crypto');

function generateToken() {
    const token = crypto.randomBytes(64);
    return token.toString('base64'); ;
}

module.exports = { generateToken }