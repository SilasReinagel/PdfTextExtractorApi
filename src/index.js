// @ts-check
const express = require('express');
const { getPdfText } = require('./pdf');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
const tmpDir = './tmp';

app.get('/', (req, res) => {
  res.send('Status: OK');
})

app.use('/getPdfText', (req, res, next) => {
  if (req.headers['content-type'] === 'application/pdf') {
    let data = [];
    req.on('data', chunk => {
      data.push(chunk);
    });
    req.on('end', () => {
      req.body = Buffer.concat(data);
      next();
    });
  } else {
    next();
  }
});

app.post('/getPdfText', async (req, res) => {
  if (!req.body || req.headers['content-type'] !== 'application/pdf') {
    return res.status(400).send({ error: 'Please upload a PDF file with the correct Content-Type.' });
  }

  const guid = uuid.v4();
  const tmpFileName = `${tmpDir}/${guid}.pdf`;
  try {
    fs.writeFileSync(tmpFileName, req.body);
    const text = await getPdfText(tmpFileName); 
    res.json({ text });
  } catch (error) {
    console.error({ error });
    res.status(500).send({ error: 'Failed to extract text from PDF.' });
  } finally {
    fs.unlinkSync(tmpFileName);
  }
});

const port = 3005;
fs.mkdirSync(tmpDir, { recursive: true });
app.listen(port, () => console.log(`Server running on port ${port}`));
