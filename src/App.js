import React, { Suspense, useEffect, useContext } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './scss/style.scss';
import StoreContext from 'src/contexts/StoreContext';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  const { jwtToken, setJwtToken, nodejs_url, csharp_url } = useContext(StoreContext);
  const { setUsersStockHistoryData, setWalletInfo, setStockInfo } = useContext(StoreContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('jwt');
    setJwtToken(token);

    // Store the token in local storage
    localStorage.setItem('jwtToken', token);
  }, []); // Run this effect only once on component mount

  useEffect(() => {
    console.log('Extracted Token:', jwtToken); // Check if the token is extracted
    if (jwtToken) {
      fetchHistoryData();
      fetchUserData();
    }
  }, [jwtToken]);

  const fetchHistoryData = async () => {
    try {
      const response = await fetch(nodejs_url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUsersStockHistoryData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch UsersStock data
      const stockResponse = await fetch(`${csharp_url}UsersStock`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      // Fetch UsersWallet data
      const walletResponse = await fetch(`${csharp_url}UsersWallet`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const stockData = await stockResponse.json();
      const walletData = await walletResponse.json();

      // Process stock data
      const updatedStockData = stockData.map((stock) => ({
        ...stock,
        totalValue: stock.finnhubStockPrice.currentPrice * stock.volume,
      }));

      // Set both stock and wallet data
      setStockInfo(updatedStockData);
      setWalletInfo(walletData);
    } catch (error) {
      console.log('Error fetching stock data:', error);
    }
  };

  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/404" element={<Page404 />} />
          <Route exact path="/500" element={<Page500 />} />
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
