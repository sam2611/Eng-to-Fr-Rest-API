const express = require('express');
const bodyParser = require('body-parser');
const { translate } = require('@vitalets/google-translate-api');
const { detect } = require('langdetect');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
  try {
    const { text } = req.body;

    // To Check if 'text' field exists in the request body
    if (!text) {
      return res.status(400).json({ error: 'Text field is required.' });
    }

    // To Check if input text contains only special characters
    if (/^[!@#$%^&*(),.?":{}|<>]+$/g.test(text)) {
        return res.status(400).json({ error: 'Input text contains only special characters.' });
      }

    const detectedLanguage = detect(text);

    // To Check if the detected language is not English
    if (detectedLanguage !== 'en') {
        return res.status(400).json({ error: 'Please enter your text in English language.' });
    }

    // Translating the text from English to French
    const translation = await translate(text, { to: 'fr' });

    // Response in french
    res.json({ translation: translation.text });
  } catch (error) {
    console.error('Translation Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});