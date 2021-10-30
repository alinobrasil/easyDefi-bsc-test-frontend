# Sort of working front end

The main functionalities are working.
 - swap some BNB --> USDT
 - approve USDT for cream finance (need to specify amount every time, for now)
 - deposit all USDT into cream finance (Mint crUSDT)
 - withdraw all USDT back int owallet

What's still missing
 - checking for transaction status. Need to know when transactions have completed so that we can know when to display a proper alert and refresh balances on page.
 - make it pretty


## How to get this up and running

Technically, this should work on BNB mainnet right now. But here's how to test locally:

1. install packages
```npm i```

2. install ganache-cli globally, if you haven't already:
```npm i -g ganche-cli```

3. Import a privateKey into your metamask for testing purposes. Never put crypto into it.

4. run ganache:
``` ganache-cli --account="0x${privatekey}, 1000000000000000000000" -f {rpc node for binance}```

By specifying the privatekey, you won't need to import any keys into metamask again while testing. Note that you need to preceed it with "0x"

5. run the app
```yarn start```
or
```npm run start```
