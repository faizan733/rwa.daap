import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useWalletConnector } from './WalletConnector.jsx';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const WalletIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="14" fill="#E8EDFF"/>
    <path d="M12 16.5C12 14.6 13.6 13 15.5 13H29C30.7 13 32 14.3 32 16V17H15.5C13.6 17 12 18.6 12 20.5V16.5Z" fill="#7186FF"/>
    <path d="M12 20.5C12 18.6 13.6 17 15.5 17H32.5C34.4 17 36 18.6 36 20.5V30.5C36 32.4 34.4 34 32.5 34H15.5C13.6 34 12 32.4 12 30.5V20.5Z" fill="#3658F5"/>
    <path d="M29 24.5H36V29.5H29C27.6 29.5 26.5 28.4 26.5 27C26.5 25.6 27.6 24.5 29 24.5Z" fill="#18A982"/>
    <circle cx="29.5" cy="27" r="1.2" fill="#FFFFFF"/>
  </svg>
);

const NetworkWalletProviders = ({ walletProvidersDialogOpen, handleWalletProvidersDialogToggle }) => {
  const { library, account } = useWeb3React();
  const { loginInjected, connError } = useWalletConnector();
  const [connecting, setConnecting] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (library && account) handleWalletProvidersDialogToggle();
  }, [library, account, handleWalletProvidersDialogToggle]);

  useEffect(() => {
    if (walletProvidersDialogOpen) {
      setConnecting(false);
      setLocalError(null);
    }
  }, [walletProvidersDialogOpen]);

  const handleConnect = async () => {
    setConnecting(true);
    setLocalError(null);
    try {
      await loginInjected();
    } catch (error) {
      setLocalError(error?.message || 'Wallet connection failed.');
    } finally {
      setConnecting(false);
    }
  };

  const displayError = localError || connError;

  return (
    <Dialog
      open={walletProvidersDialogOpen}
      onClose={handleWalletProvidersDialogToggle}
      BackdropProps={{ style: { backgroundColor: 'rgba(11,18,32,.52)' } }}
      PaperProps={{
        style: {
          background: '#FFFFFF',
          border: '1px solid #DDE2EB',
          borderRadius: 22,
          boxShadow: '0 32px 90px rgba(11,18,32,.26)',
          overflow: 'hidden',
          maxWidth: 430,
          width: '100%',
        },
      }}
      fullWidth
      maxWidth="xs"
    >
      <div style={{ height: 3, background: 'linear-gradient(90deg,var(--brand),var(--accent))' }} />
      <div style={{ padding: '28px 28px 22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <WalletIcon />
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>Connect wallet</div>
              <div className="mono" style={{ fontSize: 8, color: 'var(--brand-deep)', letterSpacing: '.16em', textTransform: 'uppercase', marginTop: 6 }}>
                Browser wallet extension
              </div>
            </div>
          </div>
          <div className="vx-copy" style={{ fontSize: 14, margin: 0 }}>
            Connect with MetaMask, Rabby, Coinbase Wallet, or any injected EIP-1193 browser wallet. This version no longer blocks testnets or local development chains.
          </div>
        </div>
        <IconButton onClick={handleWalletProvidersDialogToggle}
          sx={{ color:'var(--muted)', border:'1px solid var(--border)', borderRadius:'10px', width:34, height:34, flexShrink:0,
            '&:hover': { color:'var(--text)', borderColor:'var(--border-strong)' } }}>
          <CloseIcon sx={{ fontSize:16 }}/>
        </IconButton>
      </div>

      {displayError && (
        <div style={{ margin:'0 28px 14px', padding:'12px 14px', borderRadius:14, background:'var(--danger-soft)', border:'1px solid #f2c6ca', fontSize:13, color:'#8e3841', lineHeight:1.5 }}>
          {displayError}
        </div>
      )}

      <div style={{ padding:'0 28px 28px' }}>
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="vx-btn"
          style={{ width:'100%', minHeight:52, opacity: connecting ? .65 : 1, cursor: connecting ? 'not-allowed' : 'pointer' }}
        >
          {connecting ? 'Connecting…' : 'Connect browser wallet'}
        </button>
        <div className="mono" style={{ marginTop:14, textAlign:'center', fontSize:9, color:'var(--dim)', letterSpacing:'.08em', lineHeight:1.7 }}>
          We never store private keys. Your wallet signs transactions directly.
        </div>
      </div>
    </Dialog>
  );
};

export default NetworkWalletProviders;
