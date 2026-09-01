import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

const EMPTY_NFTS = { result: [] };
const EXPLORER_API_KEY = import.meta.env.VITE_EXPLORER_API_KEY || '';

const EXPLORER_API_BASE = {
  '0x1': 'https://api.etherscan.io/api',
  '0x5': 'https://api-goerli.etherscan.io/api',
  '0xaa36a7': 'https://api-sepolia.etherscan.io/api',
  '0x38': 'https://api.bscscan.com/api',
  '0x61': 'https://api-testnet.bscscan.com/api',
  '0x89': 'https://api.polygonscan.com/api',
  '0x13881': 'https://api-testnet.polygonscan.com/api',
};

function normalizeChainId(chainId) {
  if (typeof chainId === 'number') return `0x${chainId.toString(16)}`;
  if (typeof chainId === 'string') {
    return chainId.startsWith('0x') ? chainId.toLowerCase() : `0x${Number(chainId).toString(16)}`;
  }
  return null;
}

function getProvider() {
  if (!window.ethereum) return null;
  return new ethers.providers.Web3Provider(window.ethereum, 'any');
}

function getSignerOrProvider() {
  const provider = getProvider();
  if (!provider) return null;
  try {
    return provider.getSigner();
  } catch (_) {
    return provider;
  }
}

function createEventedTransaction(txPromise) {
  const listeners = { transactionHash: [], receipt: [], error: [] };

  txPromise
    .then(async (tx) => {
      listeners.transactionHash.forEach((cb) => cb(tx.hash));
      const receipt = await tx.wait();
      listeners.receipt.forEach((cb) => cb(receipt));
    })
    .catch((error) => listeners.error.forEach((cb) => cb(error)));

  return {
    on(eventName, callback) {
      if (listeners[eventName] && typeof callback === 'function') {
        listeners[eventName].push(callback);
      }
      return this;
    },
  };
}

function toWeiEth(value) {
  return ethers.utils.parseEther(String(value || '0')).toString();
}

function fromWei(value, decimals = 18) {
  try {
    return Number(ethers.utils.formatUnits(String(value || '0'), Number(decimals || 18)));
  } catch (_) {
    return 0;
  }
}

async function executeFunction(options = {}) {
  const { contractAddress, abi, functionName, params = {}, msgValue } = options;
  if (!contractAddress || !abi || !functionName) {
    throw new Error('Missing contract call options');
  }

  const runner = getSignerOrProvider();
  if (!runner) throw new Error('No browser wallet detected');

  const contract = new ethers.Contract(contractAddress, abi, runner);
  const method = contract[functionName];
  if (typeof method !== 'function') throw new Error(`Contract function not found: ${functionName}`);

  const fragment = contract.interface.functions[functionName] || Object.values(contract.interface.functions).find((fn) => fn.name === functionName);
  const inputs = fragment?.inputs || [];
  const args = inputs.map((input) => params[input.name]);
  const overrides = msgValue ? { value: ethers.BigNumber.from(String(msgValue)) } : undefined;
  const callArgs = overrides ? [...args, overrides] : args;

  const result = method(...callArgs);

  if (msgValue || fragment?.stateMutability === 'payable' || fragment?.stateMutability === 'nonpayable') {
    return createEventedTransaction(Promise.resolve(result));
  }

  return result;
}

async function transfer({ type, tokenId, receiver, contractAddress, amount }) {
  const signer = getSignerOrProvider();
  if (!signer || !signer.getAddress) throw new Error('No browser wallet detected');

  const from = await signer.getAddress();
  const normalizedType = String(type || '').toLowerCase();

  if (normalizedType === 'erc1155') {
    const abi = ['function safeTransferFrom(address from,address to,uint256 id,uint256 amount,bytes data)'];
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract.safeTransferFrom(from, receiver, tokenId, amount || 1, '0x');
  }

  const abi = ['function safeTransferFrom(address from,address to,uint256 tokenId)'];
  const contract = new ethers.Contract(contractAddress, abi, signer);
  return contract.safeTransferFrom(from, receiver, tokenId);
}

function onProviderEvent(eventName, callback) {
  if (!window.ethereum?.on || typeof callback !== 'function') return undefined;
  window.ethereum.on(eventName, callback);
  return () => window.ethereum?.removeListener?.(eventName, callback);
}

const Moralis = {
  Units: {
    ETH: toWeiEth,
    FromWei: fromWei,
  },
  Plugins: {},
  executeFunction,
  transfer,
  onAccountsChanged(callback) {
    return onProviderEvent('accountsChanged', callback);
  },
  onChainChanged(callback) {
    return onProviderEvent('chainChanged', callback);
  },
};

export function MoralisProvider({ children }) {
  return <>{children}</>;
}

export function useMoralis() {
  const [account, setAccount] = useState(() => window.ethereum?.selectedAddress || null);
  const [chainId, setChainId] = useState(() => normalizeChainId(window.ethereum?.chainId));

  useEffect(() => {
    if (!window.ethereum?.on) return undefined;

    const handleAccounts = (accounts = []) => setAccount(accounts[0] || null);
    const handleChain = (chain) => setChainId(normalizeChainId(chain));

    window.ethereum.on('accountsChanged', handleAccounts);
    window.ethereum.on('chainChanged', handleChain);

    return () => {
      window.ethereum.removeListener?.('accountsChanged', handleAccounts);
      window.ethereum.removeListener?.('chainChanged', handleChain);
    };
  }, []);

  const web3 = useMemo(() => ({
    _provider: window.ethereum || null,
    givenProvider: window.ethereum || null,
    eth: {
      ens: {
        getAddress: async (name) => {
          const provider = getProvider();
          if (!provider) return null;
          return provider.resolveName(name);
        },
      },
    },
  }), [account, chainId]);

  const user = useMemo(() => (
    account ? { get: (key) => (key === 'ethAddress' ? account : undefined), account } : null
  ), [account]);

  return { Moralis, web3, user, account, chainId, isInitialized: true };
}

export function useMoralisWeb3Api() {
  const resolveDomain = useCallback(async ({ domain }) => {
    const provider = getProvider();
    if (!provider || !domain) return null;
    try {
      return provider.resolveName(domain);
    } catch (_) {
      return null;
    }
  }, []);

  return { resolve: { resolveDomain } };
}

export function useNFTBalances() {
  const [data, setData] = useState(EMPTY_NFTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadNfts() {
      const account = window.ethereum?.selectedAddress;
      const chainId = normalizeChainId(window.ethereum?.chainId);
      const apiBase = EXPLORER_API_BASE[chainId];

      if (!account || !apiBase) {
        setData(EMPTY_NFTS);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const url = `${apiBase}?module=account&action=tokennfttx&address=${account}&startblock=0&endblock=99999999&sort=asc&apikey=${EXPLORER_API_KEY}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.status !== '1' || !Array.isArray(json.result)) {
          if (!cancelled) setData(EMPTY_NFTS);
          return;
        }

        const owned = new Map();
        const lowerAccount = account.toLowerCase();

        json.result.forEach((tx) => {
          const key = `${tx.contractAddress || tx.token_address}-${tx.tokenID || tx.token_id}`.toLowerCase();
          if ((tx.to || '').toLowerCase() === lowerAccount) {
            owned.set(key, {
              contract_type: 'ERC721',
              token_id: tx.tokenID || tx.token_id,
              token_address: tx.contractAddress || tx.token_address,
              name: tx.tokenName || tx.tokenSymbol || `NFT #${tx.tokenID || tx.token_id}`,
              symbol: tx.tokenSymbol || '',
              image: null,
            });
          }
          if ((tx.from || '').toLowerCase() === lowerAccount) {
            owned.delete(key);
          }
        });

        if (!cancelled) setData({ result: Array.from(owned.values()) });
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setData(EMPTY_NFTS);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadNfts();
    const handleWalletUpdate = () => loadNfts();
    window.ethereum?.on?.('accountsChanged', handleWalletUpdate);
    window.ethereum?.on?.('chainChanged', handleWalletUpdate);

    return () => {
      cancelled = true;
      window.ethereum?.removeListener?.('accountsChanged', handleWalletUpdate);
      window.ethereum?.removeListener?.('chainChanged', handleWalletUpdate);
    };
  }, []);

  return { data, isLoading, error };
}
