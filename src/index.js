// @ts-check
const express = require('express');
const { getPdfText } = require('./pdf');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
const tmpDir = './tmp';
const args = process.argv.slice(2);
const port = args[0] || 3005;
const authKey = args[1] || 'test';

const getAuthErrorCode = (request) => {
  const authorizationHeader = request.headers["authorization"]
  if (!!authorizationHeader && authorizationHeader.startsWith("Basic ")) {
    const authValue = authorizationHeader.split(" ")[1]
    if (authValue === authKey) {
      return undefined
    } else {
      console.log('Invalid authentication', { headers: request.headers, authValue, authKey })
      return 403 // Invalid authentication
    }
  }
  console.log('Unauthed', { headers: request.headers, authKey })
  return 401
}

app.get('/', (req, res) => {
  const authErrorCode = getAuthErrorCode(req)
  if (!!authErrorCode) {
    return res.status(authErrorCode).send('Unauthorized');
  }

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
  const authErrorCode = getAuthErrorCode(req)
  if (!!authErrorCode) {
    return res.status(authErrorCode).send('Unauthorized');
  }

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

console.log({ port, authKey });
fs.mkdirSync(tmpDir, { recursive: true });
app.listen(port, () => console.log(`Server running on port ${port}`));
