import axios from 'axios';
import cors from 'cors';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.COINMARKETCAP_API_KEY;

app.use(cors());

app.get('/cryptocurrency/listings/latest', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY,
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
