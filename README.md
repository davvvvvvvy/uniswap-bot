# uniswap-bot
🦄 Trading bot for Uniswap

## Usage

WETH - Token address
factory and router - Uniswap factory and router
recipient - Wallet address for recieving earnings

```
const addresses = {
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', 
  router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  recipient: '0xC651d5841c63bEd7A6AD493743482c4Ee09430c5'
}
```

Wallet mnemonic

`const mnemonic = ''`

You need to put there node web socket provider (Infura for example)

`const provider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/')`

Here you need to put how much you want to buy ETH, there is 0,001 ETH for example

`const amountIn = ethers.utils.parseUnits('0.001', 'ether')`

Important is to adjust gasPrice and gasLimit for amount you want to buy, gasPrice and gasLimit have WEI value

```
{
    gasPrice: '10000',
    gasLimit: '2000000'
},
```
