const crypto = require('crypto');
require('dotenv').config()

const algorithm = 'aes-256-cbc';
const key = Buffer.from("ce98a2ce2b48232372b35bdde337f69a017e7d6cb6c9698b949aa47d95937123","hex"); // 256-bit key
const iv = Buffer.from("439758ab8cf8b2deeed2fcf0991f1c48","hex"); // 128-bit IV

function encryptNumber(number) {
    const text = number.toString(); 
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return  encrypted;
}

function decryptNumber(encrypted) {
    const encryptedText = Buffer.from(encrypted, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return Number(decrypted); 
}


module.exports = {
    encryptNumber, decryptNumber
}

