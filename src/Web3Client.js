import Web3 from 'web3';
import {
    USDT_ABI, USDT_address,
    crUSDT_ABI, crUSDT_address,
    PancakeswapRouterV2_ABI, PancakeswapRouterV2_address,
    DEADLINE
} from './bsc_lib';


let selectedAccount;
let erc20_USDT;
let isInitialized = false;
let web3;

let USDT;
let PancakeswapV2;
let crUSDT;

export const init = () => {

    let provider = window.ethereum;

    if (typeof provider !== 'undefined') {
        //metamask is installed

        provider
            .request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                selectedAccount = accounts[0];
                console.log(`selected account is ${selectedAccount}`)
            })
            .catch(e => {
                console.log("error while getting accounts:  ", e)
                return
            })


        window.ethereum.on('accountsChanged', accounts => {
            selectedAccount = accounts[0];
            console.log(`Accoung changed to:  ${selectedAccount}`)
        })
    }

    //instantiate ojbects that interact with blockchain
    web3 = new Web3(provider);
    erc20_USDT = new web3.eth.Contract(USDT_ABI, USDT_address);
    USDT = new web3.eth.Contract(USDT_ABI, USDT_address);
    PancakeswapV2 = new web3.eth.Contract(PancakeswapRouterV2_ABI, PancakeswapRouterV2_address);
    crUSDT = new web3.eth.Contract(crUSDT_ABI, crUSDT_address)


    isInitialized = true;
}


export const getUSDTBalance = () => {
    if (!isInitialized) { init() }
    return erc20_USDT.methods.balanceOf(selectedAccount).call();
}

export const getOwnBalance = () => {
    if (!isInitialized) { init() }
    return web3.eth.getBalance(selectedAccount);
}

export const swapUSDT = async () => {
    if (!isInitialized) { init() }

    //get WBNB address
    const WBNB_ADDRESS = await PancakeswapV2.methods.WETH().call()
    console.log(`WBNB is at ${WBNB_ADDRESS} on BSC`)

    //get pair of swaps
    const pairArray = [WBNB_ADDRESS, USDT_address]
    console.log(`the pair is: ${pairArray}`)

    //get token amount to swap (1bnb)
    const tokenAmount = await PancakeswapV2.methods.getAmountsOut(web3.utils.toWei('1', 'Ether'), pairArray).call()
    console.log(`token amount to swap:`)
    console.log(`${tokenAmount[0] / 1e18} BNB for ...`)
    console.log(`${tokenAmount[1] / 1e18} USDT`)

    //do swap
    await PancakeswapV2.methods.swapETHForExactTokens(
        tokenAmount[1].toString(),
        pairArray, selectedAccount,
        DEADLINE
    ).send({
        gasLimit: 6000000,
        gasPrice: web3.utils.toWei('50', 'Gwei'),
        from: selectedAccount,
        value: web3.utils.toWei('1', 'Ether') // Amount of BNB to swap for USDT
    })

    return 1
}

export const approveUSDT = async () => {
    let USDTbalance_wei = await USDT.methods.balanceOf(selectedAccount).call()
    console.log(`USDT balance:  ${web3.utils.fromWei(USDTbalance_wei, 'Ether')}`);

    //Step1: approve
    console.log(`Approving USDT....`)
    try {
        await USDT.methods
            .approve(crUSDT_address, USDTbalance_wei)
            .send({ from: selectedAccount });
    } catch (err) {
        console.log(err)
    }
    console.log(`...Done`)

}


export const depositUSDT = async () => {
    //Step 2: Mint
    let USDTbalance_wei = await USDT.methods.balanceOf(selectedAccount).call()

    console.log(`Depositing ${USDTbalance_wei / 1e18} USDT (Minting crUSDT)...`);
    try {
        await crUSDT.methods
            .mint(USDTbalance_wei)
            .send({ from: selectedAccount, gasLimit: 5000000 })
    } catch (err) {
        console.log(err);
    }
    console.log('...Done. You are earning interest')
}

export const get_crUSDT_Balance = async () => {
    try {
        const crUSDT_Balance = await crUSDT.methods.balanceOf(selectedAccount).call()
        // console.log(`crUSDT balance is now: ${crUSDT_Balance / 1e8}`) //cTokens have 8 decimals. not 18.
        return crUSDT_Balance;
    } catch (err) {
        console.log(err)
    }

}


export const withdrawUSDT = async () => {
    try {
        const crUSDT_Balance = await crUSDT.methods.balanceOf(selectedAccount).call()
        console.log(`crUSDT balance is now: ${crUSDT_Balance}`)
        console.log(`\nWithdrawing crUSDT tokens......`)
        await crUSDT.methods.redeem(crUSDT_Balance).send({ from: selectedAccount, gasLimit: 1500000 })
        console.log("done!\n")
    } catch (err) {
        console.log(err)
    }
}