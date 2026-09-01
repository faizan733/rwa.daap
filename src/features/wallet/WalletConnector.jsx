import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';

export function getConnectorError(error) {
  const msg = error?.message || '';
  if (/No browser wallet|No wallet/i.test(msg)) {
    return 'No browser wallet detected. Please install MetaMask, Rabby, Coinbase Wallet, or another injected wallet.';
  }
  if (/rejected|denied/i.test(msg)) {
    return 'Wallet connection was rejected. Please approve the connection request in your wallet.';
  }
  return msg || 'Wallet connection failed. Please unlock your wallet and try again.';
}

export function useWalletConnector() {
  const { connect, deactivate } = useWeb3React();
  const [connError, setConnError] = useState(null);

  const loginInjected = async () => {
    setConnError(null);
    try {
      await connect();
      return true;
    } catch (error) {
      const msg = getConnectorError(error);
      setConnError(msg);
      throw new Error(msg);
    }
  };

  const loginMetamask = loginInjected;
  const loginBSC = loginInjected;
  const loginWalletConnect = async () => {
    const msg = 'WalletConnect v2 is not configured in this codebase. Please use MetaMask, Rabby, Coinbase Wallet, or another browser wallet extension.';
    setConnError(msg);
    throw new Error(msg);
  };

  const logoutWalletConnector = () => {
    try { deactivate(); } catch {}
    localStorage.removeItem('connected');
    localStorage.removeItem('wallet');
    return true;
  };

  return { loginInjected, loginMetamask, loginWalletConnect, loginBSC, logoutWalletConnector, connError };
}

export function setNet() {}
export default useWalletConnector;
