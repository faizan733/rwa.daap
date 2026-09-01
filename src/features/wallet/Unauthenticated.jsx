import { Fragment, useState } from 'react';
import WalletProviders from './NetworkWalletProviders';

export default function Unauthenticated() {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="vx-btn"
        style={{ minHeight: 40, padding: '0 16px', fontSize: 11, boxShadow: '0 10px 26px rgba(215,181,109,.14)' }}
      >
        Connect Wallet
      </button>
      <WalletProviders walletProvidersDialogOpen={open} handleWalletProvidersDialogToggle={() => setOpen(false)} />
    </Fragment>
  );
}
