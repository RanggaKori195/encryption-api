const express = require('express');
const { createEncryptedResponse } = require('./encryption');

const app = express();
app.use(express.json());

app.post('/encrypt', (req, res) => {
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({ error: 'No data provided' });
    }

    try {
        const encryptedData = createEncryptedResponse(data);
        res.json({ encryptedData });
    } catch (error) {
        res.status(500).json({ error: 'Encryption failed' });
    }
});

app.post('/decrypt', (req, res) => {
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({ error: 'No data provided' });
    }

    try {
        const decryptedData = decrypt(data);
        res.json({ decryptedData });
    } catch (error) {
        res.status(500).json({ error: 'Decryption failed' });
    }
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
