import { Fragment, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import AccountDetails from './AccountDetails';
import { getEllipsisTxt } from 'helpers/formatters';
import { ethers } from 'ethers';
import { getChainIdFromLibrary } from 'shared/config/contracts';

const Authenticated = ({ library, account }) => {
  const [balance, setBalance]                     = useState('');
  const [chainId, setChainId]                     = useState(0);
  const [accountDetailsOpen, setAccountDetailsOpen] = useState(false);

  useEffect(() => {
    if (!library) return;
    library.getBalance(account).then(bal =>
      setBalance(parseFloat(ethers.utils.formatUnits(bal, 18)).toFixed(4))
    );
    setChainId(getChainIdFromLibrary(library));
  }, [library, account]);

  return (
    <Fragment>
      {/* Balance badge */}
      <Box sx={{
        display: { xs: 'none', sm: 'flex' },
        alignItems: 'center',
        gap: 0.75,
        background: 'var(--accent-soft)',
        border: '1px solid #c8eee1',
        borderRadius: '10px',
        px: 1.8, py: 0.8,
      }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', color: '#0b7658', fontWeight: 600 }}>
          {balance} ETH
        </Typography>
      </Box>

      {/* Address chip */}
      <Chip
        label={getEllipsisTxt(account, 5)}
        onClick={() => setAccountDetailsOpen(true)}
        sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.06em',
          background: 'var(--brand-soft)',
          border: '1px solid #cbd4ff',
          color: 'var(--brand-deep)',
          borderRadius: '10px',
          height: '34px',
          cursor: 'pointer',
          '&:hover': { background: '#dce4ff', borderColor: '#aebcff' },
        }}
      />

      <AccountDetails
        accountDetailsDialogOpen={accountDetailsOpen}
        handleAccountDetailsDialogToggle={() => setAccountDetailsOpen(false)}
        data={{ balance, account, chainId }}
      />
    </Fragment>
  );
};

export default Authenticated;
