const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  organization: 'org-T2tFDUGlF2ITDfu9KUWSuN4k',
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);
const cors = require('cors');
// const response = await openai.listEngines();

// creating simple Express Api
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3080;
//get
app.post('/', async (req, res) => {
  const { message, currentModel } = req.body;
  // the prob is here
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${message}`,
    max_tokens: 150,
    temperature: 0,
  });
  res.json({
    data: response.data,
    message: response.data.choices[0].text,
  });
  //
});
app.get('/models', async (req, res) => {
  const response = await openai.listEngines();
  console.log(response.data);
  res.json({ models: response.data });
});
app.listen(port, () => {
  console.log(`example that works on https://localhost:${port}`);
});
