import { ethers } from 'ethers';
import { MAIN_CONTRACT, APP_CONTRACT, CUSD_ADDRESS, MAIN_ABI, APP_ABI, ERC20_ABI, RPC_URL } from 
'./contracts';

export { MAIN_CONTRACT, CUSD_ADDRESS };

export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function getReadOnlyProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function getMainContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const provider = signerOrProvider || getReadOnlyProvider();
  return new ethers.Contract(MAIN_CONTRACT, MAIN_ABI, provider);
}

export function getAppContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const provider = signerOrProvider || getReadOnlyProvider();
  return new ethers.Contract(APP_CONTRACT, APP_ABI, provider);
}

export function getCUSDContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const provider = signerOrProvider || getReadOnlyProvider();
  return new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, provider);
}

export async function connectWallet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask');
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 42220) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xA4EC' }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xA4EC',
            chainName: 'Celo Mainnet',
            nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
            rpcUrls: ['https://forno.celo.org'],
            blockExplorerUrls: ['https://celoscan.io'],
          }],
        });
      }
    }
  }
  
  return await provider.getSigner();
}

export function formatCUSD(amount: bigint): string {
  return ethers.formatUnits(amount, 18);
}

export function parseCUSD(amount: string): bigint {
  return ethers.parseUnits(amount, 18);
}
