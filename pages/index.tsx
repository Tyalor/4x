"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [apiKey, setApiKey] = useState('');
  const [currencyPair, setCurrencyPair] = useState('EURUSD'); // Default currency pair
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastFetchedTime, setLastFetchedTime] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasSubmitted || !apiKey) return;

    const interval = setInterval(() => {
      fetchExchangeRate();
    }, 10000); // Adjusted to 10 seconds for API rate limit considerations

    return () => clearInterval(interval);
  }, [hasSubmitted, apiKey, currencyPair]);

  const fetchExchangeRate = async () => {
    setIsFetching(true);
    setError('');
    const from_currency = currencyPair.slice(0, 3);
    const to_currency = currencyPair.slice(3, 6);
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from_currency}&to_currency=${to_currency}&apikey=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data && response.data['Realtime Currency Exchange Rate']) {
        setExchangeRate(response.data['Realtime Currency Exchange Rate']);
        setLastFetchedTime(new Date().toLocaleTimeString());
      } else {
        setError('Failed to retrieve data. Please check your API key and try again.');
      }
    } catch (error) {
      console.error('Error fetching currency exchange rate:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    setExchangeRate(null);
    setHasSubmitted(true);
  };

  return (
    <div className="bg-black text-green-500 min-h-screen flex flex-col items-center justify-center p-4">
      {!hasSubmitted || error ? (
        <form onSubmit={handleApiKeySubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <div>
              <label className="block text-lg mb-2">
                Enter your Alpha Vantage API Key:
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1 px-3 py-2 bg-green-200 text-green-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-lg mb-2">
                Select Currency Pair:
              </label>
              <select
                value={currencyPair}
                onChange={(e) => setCurrencyPair(e.target.value)}
                className="mt-1 px-3 py-2 bg-green-200 text-green-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              >
                <option value="EURUSD">EUR/USD</option>
                <option value="USDJPY">USD/JPY</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="USDCHF">USD/CHF</option>
                <option value="AUDUSD">AUD/USD</option>
                <option value="USDCAD">USD/CAD</option>
              </select>
            </div>
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white mt-4">
              Submit
            </button>
          </div>
        </form>
        </div>
      ) : null}

      {isFetching && <p>Loading data...</p>}

      {error && <p className="text-red-500">{error}</p>}

   {exchangeRate && (
  <>
    <h1 className="text-xl font-bold mb-4">Currency Exchange Rate ({currencyPair.slice(0, 3)}/{currencyPair.slice(3, 6)})</h1>
    <ul>
      <li>From Currency Code: {exchangeRate['1. From_Currency Code']}</li>
      <li>To Currency Code: {exchangeRate['2. To_Currency Code']}</li>
      <li>Exchange Rate: {exchangeRate['5. Exchange Rate']}</li>
      <li>Last Refreshed: {exchangeRate['6. Last Refreshed']}</li>
      <li>Time Zone: {exchangeRate['7. Time Zone']}</li>
    </ul>
    <p>Last fetched time: {lastFetchedTime}</p>
  </>
)}

);
};

export default Home;