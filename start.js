const ethers = require('ethers')

const addresses = {
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', 
  router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  recipient: '0xC651d5841c63bEd7A6AD493743482c4Ee09430c5'
}

const mnemonic = ''

const provider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/')
const wallet = ethers.Wallet.fromMnemonic(mnemonic)
const account = wallet.connect(provider)
const factory = new ethers.Contract(
  addresses.factory,
  ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
  account
);
const router = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ],
  account
);

factory.on('PairCreated', async (token0, token1, pairAddress) => {
  console.log(`
    New pair detected
    =================
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `)

  let tokenIn, tokenOut
  if(token0 === addresses.WETH) {
    tokenIn = token0
    tokenOut = token1
  }

  if(token1 == addresses.WETH) {
    tokenIn = token1 
    tokenOut = token0
  }

  if(typeof tokenIn === 'undefined') {
    return
  }
  const amountIn = ethers.utils.parseUnits('0.001', 'ether')
  const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut])
  const amountOutMin = amounts[1].sub(amounts[1].div(10))
  console.log(`
    Buying new token
    =================
    tokenIn: ${amountIn.toString()} ${tokenIn} (WETH)
    tokenOut: ${amountOutMin.toString()} ${tokenOut}
  `)
  const tx = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    [tokenIn, tokenOut],
    addresses.recipient,
    Date.now() + 1000 * 60 * 10,
    {
      gasPrice: '10000',
      gasLimit: '2000000'
    },
  )
  const receipt = await tx.wait()
  console.log('Transaction receipt')
  console.log(receipt);
})