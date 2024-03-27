import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');

const dexAbis = {
  '0x123...': require('./abi/dex1ABI.json'),
  '0x456...': require('./abi/dex2ABI.json'),
};

const API_KEY_ALCHEMY = process.env.ALCHEMY_API_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY_COINMARKETCAP = process.env.COINMARKETCAP_API_KEY;

app.use(cors());

app.get('/arbitrage-pairs', async (_req, res) => {
  try {
    const web3 = createAlchemyWeb3(API_KEY_ALCHEMY);

    const dexAddresses = ['0x123...', '0x456...', '0x789...'];

    const pairs = [];

    for (const dexAddress of dexAddresses) {
      // Get the list of trading pairs from the DEX contract
      const dexContract = new web3.eth.Contract(
        dexAbis[dexAddress],
        dexAddress
      );
      const tradingPairs = await dexContract.methods.getTradingPairs().call();

      // Add the trading pairs to the list
      pairs.push(...tradingPairs);
    }

    res.json({ pairs });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/cryptocurrency/listings/latest', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY_COINMARKETCAP,
        },
      }
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching data from CoinMarketCap',
      details: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
