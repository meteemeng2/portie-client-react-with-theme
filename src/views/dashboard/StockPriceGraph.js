import React, { useState, useEffect, useRef, useContext } from "react";
import { Chart } from "chart.js";
import { CChartLine } from '@coreui/react-chartjs'
import "chartjs-adapter-moment"; // Import the moment.js adapter
import "chartjs-adapter-luxon"; // Import the Luxon adapter
import StoreContext from 'src/contexts/StoreContext';
import {
  CButton,
  CButtonGroup,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
} from '@coreui/icons'

import { getStyle, hexToRgba } from '@coreui/utils'

const StockPriceGraph = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const { usersStockHistoryData, setUsersStockHistoryData } = useContext(StoreContext);
  const { stockInfo, setStockInfo } = useContext(StoreContext);
  const { walletInfo, setWalletInfo } = useContext(StoreContext);
  const wallet_port_data = walletInfo.reduce((accumulator, object) => accumulator + object.volume, 0);
  const chartRef = useRef(null);

  useEffect(() => {
    if (usersStockHistoryData.length > 0 && chartRef.current && stockInfo.length > 0) {
      // Create an object to store the sum of closing prices for each date
      const sumByDate = {};

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

      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      setChartData({
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
            data: data.map((meng) => meng + wallet_port_data),
            borderColor: "rgba(75, 75, 75, 1)",
            backgroundColor: "rgba(75, 75, 75, 0.2)",
            borderWidth: 2,
          },
        ],
      });

    }
  }, [usersStockHistoryData, stockInfo, walletInfo]);

  return (
    <CCardBody>
      <CRow>
        <CCol sm={5}>
          <h4 id="traffic" className="card-title mb-0">
            Traffic
          </h4>
          <div className="small text-medium-emphasis">January - July 2021</div>
        </CCol>
        <CCol sm={7} className="d-none d-md-block">
          <CButton color="primary" className="float-end">
            <CIcon icon={cilCloudDownload} />
          </CButton>
          <CButtonGroup className="float-end me-3">
            {['Day', 'Month', 'Year'].map((value) => (
              <CButton
                color="outline-secondary"
                key={value}
                className="mx-0"
                active={value === 'Month'}
              >
                {value}
              </CButton>
            ))}
          </CButtonGroup>
        </CCol>
      </CRow>
      <CChartLine
        data={{
          labels: chartData.labels,
          datasets: chartData.datasets,
        }}
        ref={chartRef}
      />
    </CCardBody>
  );
};

export default StockPriceGraph;
