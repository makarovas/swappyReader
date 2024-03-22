import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface CryptoQuote {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
    };
  };
}

const DexQuotes: React.FC = () => {
  const [quotes, setQuotes] = useState<CryptoQuote[] | null>(null);

  useEffect(() => {
    const getQuotes = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/cryptocurrency/listings/latest'
        );
        setQuotes(response.data.data);
      } catch (error) {
        console.error('Error fetching quotes:', error);
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
