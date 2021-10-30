// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import {
  init, getOwnBalance, getUSDTBalance,
  swapUSDT, approveUSDT, depositUSDT, get_crUSDT_Balance, withdrawUSDT
} from './Web3Client'


function App() {
  // const providerUrl = 'http://localhost:8545';
  // // process.env.REACT_APP_providerURL;

  // console.log('ProviderURL: ', providerUrl);

  const [balance, setBalance] = useState(0);
  const [USDTbalance, setUSDTbalance] = useState(0);
  const [crUSDTbalance, setcrUSDTbalance] = useState(0);


  useEffect(() => {
    // const web3 = new Web3(providerUrl);
    init();
  }, [])

  const fetchUSDTBalance = () => {
    getUSDTBalance().then(USDTbalance => {
      setUSDTbalance(USDTbalance);
      console.log("USDT balance: ", (USDTbalance / 1e18).toFixed(2));
    }).catch(err => {
      console.log(err)
    })
  }

  const fetchbalance = () => {
    getOwnBalance().then(balance => {
      setBalance(balance);
      console.log("BNB balance: ", (balance / 1e18).toFixed(2));

    }).catch(e => {
      console.log(e)
    })
  }

  function refreshBalances() {
    fetchbalance();
    fetchUSDTBalance();

    get_crUSDT_Balance().then(crUSDTbalance => {
      setcrUSDTbalance(crUSDTbalance);
      console.log("crUSDT balance: ", (crUSDTbalance / 1e8).toFixed(2))
    })
  }


  return (
    <div className="App">

      <h3 >Your Wallet</h3>

      <button className="button" onClick={refreshBalances}> Refresh Balances </button>

      <br /><br />
      <table className="balanceTable">

        <thead> <tr>
          <th>Coin</th>     <th>Balance</th>
        </tr>  </thead>

        <tbody>
          <tr>
            <td>BNB</td>     <td>  {(balance / 1e18).toFixed(2)} </td>
          </tr>
          <tr>
            <td>USDT</td>     <td>  {(USDTbalance / 1e18).toFixed(2)} </td>
          </tr>
          <tr>
            <td>crUSDT</td>   <td>  {(crUSDTbalance / 1e8).toFixed(2)} </td>
          </tr>
        </tbody>
      </table>

      <br /><br />

      <button className="button" onClick={swapUSDT}>Sell 1 BNB to get some USDT</button>

      <br /><br />
      <button className="button" onClick={approveUSDT}>Approve USDT to be used on Cream Finance</button>

      <br /><br />
      <button className="button" onClick={depositUSDT}>Deposit USDT into Cream Finance</button>

      <br /><br />
      <button className="button" onClick={withdrawUSDT}>Withdraw all USDT back into wallet</button>
    </div>
  );
}

export default App;
