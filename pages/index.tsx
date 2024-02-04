
"use client";
import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [apiKey, setApiKey] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState(''); // To store any error messages

  const fetchExchangeRate = async () => {
    if (!apiKey) return;

    setIsFetching(true);
    setError(''); // Reset error message before fetching
    const from_currency = 'EUR';
    const to_currency = 'USD';
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from_currency}&to_currency=${to_currency}&apikey=${apiKey}`;

    try {
      const response = await axios.get(url);
      console.log('API Response:', response); // Log response for debugging

      // Check if the response contains the expected data
      if (response.data && response.data['Realtime Currency Exchange Rate']) {
        setExchangeRate(response.data['Realtime Currency Exchange Rate']);
      } else {
        // Handle cases where the response may not be in the expected format
        setError('Failed to retrieve data. Please check your API key and try again.');
        console.error('Unexpected response format:', response);
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
    setExchangeRate(null); // Clear previous data
    setHasSubmitted(true); // Indicate that a submit has occurred
    fetchExchangeRate();
  };

  return (
    <div className="bg-black text-green-500 min-h-screen flex flex-col items-center justify-center p-4">
      {!hasSubmitted || error ? (
        <form onSubmit={handleApiKeySubmit} className="space-y-4">
          <div className="flex flex-col items-center">
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
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white mt-4">
              Submit
            </button>
          </div>
        </form>
      ) : null}

      {isFetching && <p>Loading data...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {exchangeRate && (
        <>
          <h1 className="text-xl font-bold mb-4">Currency Exchange Rate (EUR/USD)</h1>
          <ul>
            <li>From Currency Code: {exchangeRate['1. From_Currency Code']}</li>
            <li>To Currency Code: {exchangeRate['2. To_Currency Code']}</li>
            <li>Exchange Rate: {exchangeRate['5. Exchange Rate']}</li>
            <li>Last Refreshed: {exchangeRate['6. Last Refreshed']}</li>
            <li>Time Zone: {exchangeRate['7. Time Zone']}</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default Home;