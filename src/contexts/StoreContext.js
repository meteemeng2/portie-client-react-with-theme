// StoreContext.js
import React, { createContext, useState } from 'react';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  //URL
  //const csharp_url = `http://212.80.212.18/portie/Home/`;
  const csharp_url = `http://localhost:7778/Home/`;
  const nodejs_url = `http://localhost:3333/api/stocks`;

  //JWT
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken') || '');


  // everyday price
  const [usersStockHistoryData, setUsersStockHistoryData] = useState([]);

  // doughnut and table
  const [walletInfo, setWalletInfo] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);

  //loading

  const [loading, setLoading] = useState(true);

  return (
    <StoreContext.Provider value={{
      csharp_url, nodejs_url
      , jwtToken, setJwtToken
      , usersStockHistoryData, setUsersStockHistoryData
      , walletInfo, setWalletInfo
      , stockInfo, setStockInfo
      , loading, setLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
