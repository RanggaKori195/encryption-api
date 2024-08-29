const crypto = require('crypto');

const secretKey = Buffer.from('0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF', 'hex');

function padTo8Bytes(str) {
    const padLength = 8 - (str.length % 8);
    return str + 'F'.repeat(padLength);
}

function encrypt(data) {
    try {
        const paddedData = padTo8Bytes(Buffer.from(data).toString('hex'));
        const cipher = crypto.createCipheriv('des-ede3', secretKey, null);
        let encrypted = cipher.update(paddedData, 'hex', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error('Encryption failed:', error.message);
        throw new Error('Encryption failed');
    }
}

function generateMAC(encryptedBody) {
    const lastByte = encryptedBody.slice(-2);
    const footer = lastByte + 'FFFFFFFFFFFFFF';
    const cipher = crypto.createCipheriv('des-ede3', secretKey, null);
    let mac = cipher.update(footer, 'hex', 'hex');
    mac += cipher.final('hex');
    return mac;
}

function createHeader(secretKeyID, encryptedBody, mac) {
    const length = (1 + encryptedBody.length / 2 + 8).toString(16).padStart(4, '0');
    return length + secretKeyID;
}

function createEncryptedResponse(data, secretKeyID = '01') {
    const encryptedBody = encrypt(data);
    const mac = generateMAC(encryptedBody);
    const header = createHeader(secretKeyID, encryptedBody, mac);
    return header + encryptedBody + mac;
}

module.exports = {
    createEncryptedResponse,
};
