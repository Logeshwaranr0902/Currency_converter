import React, { useState, useEffect } from "react";
import gradientBg from "../assets/gradientBg.jpg";
import SwapVertIcon from "@mui/icons-material/SwapVert";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [currencyNames, setCurrencyNames] = useState({});
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRates, setExchangeRates] = useState({});

  const fetchCurrencies = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const countries = await response.json();

      const currencyData = {};
      countries.forEach((country) => {
        if (country.currencies) {
          Object.entries(country.currencies).forEach(([code, details]) => {
            currencyData[code] = details.name; // Store currency code and full name
          });
        }
      });

      setCurrencies(Object.keys(currencyData));
      setCurrencyNames(currencyData); // Store currency names

      // Fetch exchange rates
      const exchangeResponse = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      const exchangeData = await exchangeResponse.json();
      setExchangeRates(exchangeData.rates);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const convertCurrency = () => {
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];

    if (fromRate && toRate) {
      const result = (fromAmount / fromRate) * toRate;
      setConvertedAmount(result);
    }
  };

  // Function to interchange currencies
  const interchangeCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${gradientBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-filter backdrop-blur-md" />
      <form
        className="bg-blue-400 bg-opacity-40 shadow-lg rounded-xl p-8 flex flex-col w-full max-w-md relative z-10"
        onSubmit={(e) => {
          e.preventDefault();
          convertCurrency();
        }}
      >
        <h2 className="text-center text-4xl font-bold text-gray-900 mb-6">
          Currency Converter
        </h2>

        <div className="flex mb-4 items-center">
          <input
            type="number"
            placeholder="Enter amount"
            className="border border-gray-300 rounded-lg p-2 w-full"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
          />
        </div>

        <div className="flex flex-row mb-6">
          <div>
            <div className="mb-6 ">
              <select
                className="border border-gray-300 rounded-lg p-2 w-full mr-2"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency} - {currencyNames[currency] || "Unknown Currency"}
                  </option>
                ))}
              </select>
            </div>

            <div className="">
              <select
                className="border border-gray-300 rounded-lg p-2 w-full"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency} - {currencyNames[currency] || "Unknown Currency"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg h-80% ml-2 h-full"
              onClick={interchangeCurrencies}
            >
              <SwapVertIcon />
            </button>
          </div>
        </div>

        {convertedAmount > 0 && (
          <div className="bg-blue-50 text-blue-600 text-xl p-4 rounded-lg mb-6 text-center">
            {`${fromAmount} ${fromCurrency} = ${convertedAmount.toFixed(
              2
            )} ${toCurrency}`}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg w-full transition duration-300 shadow-md transform hover:scale-105"
        >
          Convert
        </button>
      </form>
    </div>
  );
};

export default CurrencyConverter;
