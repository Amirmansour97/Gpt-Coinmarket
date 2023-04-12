import { Configuration, OpenAIApi } from 'openai';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

const configuration = new Configuration({
  organization: 'org-T2tFDUGlF2ITDfu9KUWSuN4k',
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

//server
const app = express();
const port = 3050;
app.use(bodyParser.json());
app.use(cors());

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '6a135429f3mshac60a861523c981p171099jsn1a82f61baa7c',
    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
  },
};

async function getBitcoinData() {
  const response = await fetch(
    'https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0',
    options
  );
  const data = await response.json();
  return data;
}

app.post('/', async (req, res) => {
  const { message } = req.body;
  let model = 'gpt-3.5-turbo';
  let prompt = '';
  // app.post('/', async (req, res) => {
  //   const { message } = req.body;
  //   const completion = await openai.createChatCompletion({
  //     model: 'gpt-3.5-turbo',
  //     messages: [{ role: 'user', content: `${message}` }],
  //   });
  //   res.json({ completion: completion.data.choices[0].message });
  // });

  // check if message is related to Bitcoin
  if (message.toLowerCase().includes('bitcoin')) {
    // model = 'gpt-3.5-turbo';
    const bitcoinData = await getBitcoinData();
    // ${bitcoinData.data.base.symbol} kan fl a5er gmb bitcoin data
    prompt = `What is the current price of Bitcoin? \n\nThe current price of Bitcoin is ${bitcoinData.data.coins[0].price} .`;
  } else {
    prompt = message;
  }

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: `${message}` }],
    // maxTokens: 1024,
    // n: 1,
    // stop: '\n',
  });
  res.json({ completion: completion.data.choices[0].message });
  // res.json({ completion: completion.choices[0].text.trim() });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
