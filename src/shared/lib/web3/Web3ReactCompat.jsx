import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext({
  account: null,
  chainId: null,
  library: null,
  active: false,
  error: null,
  connect: async () => false,
  activate: async () => false,
  deactivate: () => {},
});

export class UnsupportedChainIdError extends Error {
  constructor(message = 'Unsupported chain id') {
    super(message);
    this.name = 'UnsupportedChainIdError';
  }
}

function normalizeChainId(chainId) {
  if (typeof chainId === 'number') return chainId;
  if (typeof chainId === 'string') {
    return chainId.startsWith('0x') ? parseInt(chainId, 16) : Number(chainId);
  }
  return null;
}

function makeLibrary(provider, chainId) {
  const library = new ethers.providers.Web3Provider(provider, 'any');
  library.pollingInterval = 12000;

  // Do NOT mutate `library.provider.chainId`. Some injected wallet providers expose
  // chainId as a read-only getter, and assigning to it throws:
  // "Cannot set property chainId ... which has only a getter".
  // Store VaultX's normalized chain id on the ethers wrapper instead.
  Object.defineProperty(library, '_vaultxChainId', {
    value: chainId,
    configurable: true,
    enumerable: false,
    writable: true,
  });

  return library;
}

async function buildConnection() {
  const provider = window.ethereum;
  if (!provider?.request) {
    throw new Error('No browser wallet detected. Please install MetaMask, Rabby, Coinbase Wallet, or another injected wallet.');
  }

  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  const account = accounts?.[0] || null;
  if (!account) throw new Error('No wallet account returned. Please unlock your wallet and try again.');

  const chainHex = await provider.request({ method: 'eth_chainId' });
  const chainId = normalizeChainId(chainHex);
  const library = makeLibrary(provider, chainId);

  return { provider, library, account, chainId };
}

export function Web3ReactProvider({ children }) {
  const [state, setState] = useState({ account: null, chainId: null, library: null, active: false, error: null });

  const connect = useCallback(async () => {
    try {
      const { library, account, chainId } = await buildConnection();
      setState({ library, account, chainId, active: true, error: null });
      localStorage.setItem('connected', 'injected');
      localStorage.setItem('wallet', 'injected');
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, error }));
      throw error;
    }
  }, []);

  const deactivate = useCallback(() => {
    setState({ account: null, chainId: null, library: null, active: false, error: null });
    localStorage.removeItem('connected');
    localStorage.removeItem('wallet');
  }, []);

  const activate = useCallback(async () => connect(), [connect]);

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider?.on) return undefined;

    const handleAccountsChanged = async (accounts = []) => {
      if (!accounts.length) {
        deactivate();
        return;
      }
      try {
        const chainHex = await provider.request({ method: 'eth_chainId' });
        const chainId = normalizeChainId(chainHex);
        const library = makeLibrary(provider, chainId);
        setState({ library, account: accounts[0], chainId, active: true, error: null });
      } catch (error) {
        setState(prev => ({ ...prev, error }));
      }
    };

    const handleChainChanged = async (chainHex) => {
      const chainId = normalizeChainId(chainHex);
      const account = state.account;
      const library = makeLibrary(provider, chainId);
      setState(prev => ({ ...prev, library, chainId, account: account || prev.account, active: !!(account || prev.account) }));
    };

    const handleDisconnect = () => deactivate();

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    provider.on('disconnect', handleDisconnect);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
      provider.removeListener?.('chainChanged', handleChainChanged);
      provider.removeListener?.('disconnect', handleDisconnect);
    };
  }, [deactivate, state.account]);

  useEffect(() => {
    if (localStorage.getItem('connected') && window.ethereum?.request) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (!accounts?.length) return;
          const chainHex = await window.ethereum.request({ method: 'eth_chainId' });
          const chainId = normalizeChainId(chainHex);
          const library = makeLibrary(window.ethereum, chainId);
          setState({ library, account: accounts[0], chainId, active: true, error: null });
        })
        .catch(() => {});
    }
  }, []);

  const value = useMemo(() => ({ ...state, connect, activate, deactivate }), [state, connect, activate, deactivate]);

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3React() {
  return useContext(Web3Context);
}
