import React, { useEffect, useRef, useContext } from "react";
import { Chart } from "chart.js";
import "chartjs-adapter-moment"; // Import the moment.js adapter
import "chartjs-adapter-luxon"; // Import the Luxon adapter
import StoreContext from 'src/contexts/StoreContext';

const StockPriceGraph = ({ }) => {

  const { usersStockHistoryData, setUsersStockHistoryData } = useContext(StoreContext);
  const { stockInfo, setStockInfo } = useContext(StoreContext);
  const { walletInfo, setWalletInfo } = useContext(StoreContext);

  const chartRef = useRef(null);

  useEffect(() => {
    if (usersStockHistoryData.length > 0 && chartRef.current && stockInfo.length > 0) {
      // Create an object to store the sum of closing prices for each date
      const sumByDate = {};

      // Calculate the total volume in the wallet
      const wallet_port_data = walletInfo.reduce((accumulator, object) => accumulator + object.volume, 0);

      // Calculate the sum of closing prices for each date and update the respective sums
      usersStockHistoryData.forEach((item) => {
        const date = item.price_date.split('T')[0]; // Extract the date part from the datetime string

        // Find the volume for the corresponding stock symbol
        const volume = stockInfo.find((stock) => stock.stockSymbol === item.stock_symbol)?.volume;
        const kof = item.closing_price * volume;

        sumByDate[date] = (sumByDate[date] || 0) + kof;
      });

      // Extract the dates and corresponding sums from the objects
      const labels = Object.keys(sumByDate);
      const data = Object.values(sumByDate);

      const ctx = chartRef.current.getContext("2d");

      // Check if a chart instance already exists and destroy it before creating a new chart
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      chartRef.current.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Sum of Closing Prices Stock",
              data: data,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
            },
            {
              label: "Sum of Port",
              data: data.map(meng => meng + wallet_port_data),
              borderColor: "rgba(75, 75, 75, 1)",
              backgroundColor: "rgba(75, 75, 75, 0.2)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
              ticks: {
                maxRotation: 0,
                minRotation: 0,
              },
            },
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Stock Price",
            },
          },
        },
      });
    }
  }, [usersStockHistoryData, stockInfo, walletInfo]);

  return <canvas ref={chartRef}></canvas>;
};

export default StockPriceGraph;
