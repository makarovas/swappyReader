import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface CryptoQuote {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      // Дополнительные поля котировки, если необходимо
    };
  };
}

const VITE_COINMARKETCAP_API_KEY = import.meta.env.VITE_COINMARKETCAP_API_KEY;

const DexQuotes: React.FC = () => {
  const [quotes, setQuotes] = useState<CryptoQuote[] | null>(null);

  useEffect(() => {
    const getQuotes = async () => {
      try {
        const response = await axios.get(
          'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
          {
            headers: {
              'X-CMC_PRO_API_KEY': VITE_COINMARKETCAP_API_KEY,
            },
          }
        );

        const quotes: CryptoQuote[] = response.data.data;
        console.log(quotes); // Логировать котировки
        setQuotes(quotes); // Сохранить котировки в состоянии
      } catch (ex) {
        console.error('Error fetching quotes:', ex);
      }
    };

    getQuotes();
  }, []);

  return (
    <div>
      <h1>Dex Quotes</h1>
      {quotes ? (
        quotes.map((crypto) => (
          <div key={crypto.id}>
            <h2>
              {crypto.name} ({crypto.symbol}): $
              {crypto.quote.USD.price.toFixed(2)}
            </h2>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DexQuotes;
