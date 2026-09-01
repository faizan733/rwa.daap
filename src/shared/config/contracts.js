export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const NETWORKS = {
  1: { name: 'Ethereum Mainnet', symbol: 'ETH', explorer: 'https://etherscan.io' },
  5: { name: 'Goerli Testnet', symbol: 'ETH', explorer: 'https://goerli.etherscan.io' },
  11155111: { name: 'Sepolia Testnet', symbol: 'ETH', explorer: 'https://sepolia.etherscan.io' },
  56: { name: 'BNB Smart Chain', symbol: 'BNB', explorer: 'https://bscscan.com' },
  97: { name: 'BNB Testnet', symbol: 'tBNB', explorer: 'https://testnet.bscscan.com' },
  31337: { name: 'Hardhat Local', symbol: 'ETH', explorer: '' },
  1337: { name: 'Localhost', symbol: 'ETH', explorer: '' },
};

const env = import.meta.env || {};

export const CONTRACTS_BY_CHAIN = { 
  1: {
    token: env.VITE_TOKEN_ADDRESS_1 || env.VITE_TOKEN_ADDRESS || '',
    presale: env.VITE_PRESALE_ADDRESS_1 || env.VITE_PRESALE_ADDRESS || '',
  },
  5: {
    token: env.VITE_TOKEN_ADDRESS_5 || '',
    presale: env.VITE_PRESALE_ADDRESS_5 || '',
  },
  11155111: {
    token: env.VITE_TOKEN_ADDRESS_11155111 || env.VITE_TOKEN_ADDRESS_SEPOLIA || '',
    presale: env.VITE_PRESALE_ADDRESS_11155111 || env.VITE_PRESALE_ADDRESS_SEPOLIA || '',
  },
  56: {
    token: env.VITE_TOKEN_ADDRESS_56 || env.VITE_BSC_TOKEN_ADDRESS || '',
    presale: env.VITE_PRESALE_ADDRESS_56 || env.VITE_BSC_PRESALE_ADDRESS || '',
  },
  97: {
    token: env.VITE_TOKEN_ADDRESS_97 || env.VITE_BSC_TESTNET_TOKEN_ADDRESS || '',
    presale: env.VITE_PRESALE_ADDRESS_97 || env.VITE_BSC_TESTNET_PRESALE_ADDRESS || '',
  },
  31337: {
    token: env.VITE_TOKEN_ADDRESS_31337 || env.VITE_LOCAL_TOKEN_ADDRESS || '',
    presale: env.VITE_PRESALE_ADDRESS_31337 || env.VITE_LOCAL_PRESALE_ADDRESS || '',
  },
  1337: {
    token: env.VITE_TOKEN_ADDRESS_1337 || env.VITE_LOCAL_TOKEN_ADDRESS || '',
    presale: env.VITE_PRESALE_ADDRESS_1337 || env.VITE_LOCAL_PRESALE_ADDRESS || '',
  },
};

export function isAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value || '') && value !== ZERO_ADDRESS;
}

export function getChainIdFromLibrary(library) {
  const raw = library?._vaultxChainId ?? library?.network?.chainId ?? library?.provider?.chainId;
  if (!raw) return null;
  return typeof raw === 'string' ? parseInt(raw, raw.startsWith('0x') ? 16 : 10) : Number(raw);
}

export function getNetworkMeta(chainId) {
  return NETWORKS[chainId] || { name: `Chain ${chainId || 'Unknown'}`, symbol: 'ETH', explorer: '' };
}

export function getContracts(chainId) {
  return CONTRACTS_BY_CHAIN[chainId] || { token: '', presale: '' };
}
