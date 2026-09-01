import { useState } from 'react';
import copy from 'copy-to-clipboard';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import vaultxMark from 'assets/images/vaultx-mark.svg';
import { CONTRACTS_BY_CHAIN, NETWORKS, isAddress } from 'shared/config/contracts';

const VAULTX_PUBLIC_ADDRESS = import.meta.env.VITE_PUBLIC_VAULTX_ADDRESS || '0xBb569C738f56348B21a84D520f679fe41Fd01cc5';

function buildRows() {
  const deployed = Object.entries(CONTRACTS_BY_CHAIN)
    .map(([chainId, addresses]) => ({ chainId: Number(chainId), addresses, network: NETWORKS[Number(chainId)] }))
    .filter(({ addresses }) => isAddress(addresses.presale) || isAddress(addresses.token));

  const rows = [
    {
      label: 'Public VaultX Address',
      value: VAULTX_PUBLIC_ADDRESS,
      status: 'Public',
      note: 'Primary public VaultX wallet address used for project communication and transparency. This is not used as the presale contract unless explicitly configured in .env.',
      copyable: true,
    },
  ];

  if (deployed.length === 0) {
    rows.push(
      {
        label: 'VaultX Token',
        value: 'Not configured in .env',
        status: 'Disabled',
        note: 'Set VITE_TOKEN_ADDRESS or VITE_TOKEN_ADDRESS_<CHAIN_ID> after deploying VaultXToken.',
        copyable: false,
      },
      {
        label: 'VaultX Presale',
        value: 'Not configured in .env',
        status: 'Disabled',
        note: 'Set VITE_PRESALE_ADDRESS or VITE_PRESALE_ADDRESS_<CHAIN_ID>. Frontend presale actions stay disabled until this is valid.',
        copyable: false,
      }
    );
  } else {
    deployed.forEach(({ chainId, addresses, network }) => {
      rows.push({
        label: `${network?.name || `Chain ${chainId}`} Token`,
        value: isAddress(addresses.token) ? addresses.token : 'Not configured',
        status: isAddress(addresses.token) ? 'Ready' : 'Missing',
        note: `Token address for chain ID ${chainId}.`,
        copyable: isAddress(addresses.token),
      });
      rows.push({
        label: `${network?.name || `Chain ${chainId}`} Presale`,
        value: isAddress(addresses.presale) ? addresses.presale : 'Not configured',
        status: isAddress(addresses.presale) ? 'Ready' : 'Missing',
        note: `Presale address for chain ID ${chainId}. This address is what the frontend uses for deposits, claims, and refunds.`,
        copyable: isAddress(addresses.presale),
      });
    });
  }

  rows.push({
    label: 'Proxy / Upgrade Admin',
    value: 'Not configured for local preview',
    status: 'Local safe',
    note: 'No external proxy explorer link is opened locally. Add a verified proxy/admin address only when production deployment is ready.',
    copyable: false,
  });

  return rows;
}

function ContractItem({ row }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!row.copyable) return;
    copy(row.value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.4 },
        borderRadius: '18px',
        border: '1px solid var(--border)',
        background: 'var(--surface-2)',
      }}
    >
      <Stack direction="row" spacing={1.4} alignItems="center" justifyContent="space-between" sx={{ mb: 1.4 }}>
        <Typography
          sx={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '10px',
            color: 'var(--brand-deep)',
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            lineHeight: 1.5,
          }}
        >
          {row.label}
        </Typography>
        <Chip
          label={row.status}
          size="small"
          sx={{
            height: 26,
            color: row.status === 'Public' ? '#fff' : 'var(--brand-deep)',
            background: row.status === 'Public'
              ? 'var(--brand)'
              : 'var(--brand-soft)',
            border: '1px solid #cbd4ff',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '8px',
            letterSpacing: '.08em',
            textTransform: 'uppercase',
          }}
        />
      </Stack>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            p: '12px 14px',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            background: '#fff',
            color: row.copyable ? 'var(--text)' : 'var(--muted)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: { xs: '10px', sm: '11px' },
            lineHeight: 1.7,
            wordBreak: 'break-all',
          }}
        >
          {row.value}
        </Box>
        {row.copyable && (
          <Button
            onClick={handleCopy}
            variant="contained"
            sx={{ minWidth: 106, height: 44 }}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        )}
      </Box>

      <Typography sx={{ mt: 1.3, color: 'var(--muted)', fontSize: '13px', lineHeight: 1.7 }}>
        {row.note}
      </Typography>
    </Box>
  );
}

export default function Contracts({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      BackdropProps={{ style: { backgroundColor: 'rgba(11,18,32,.52)' } }}
      PaperProps={{
        style: {
          background: '#F3F5F9',
          border: '1px solid #DDE2EB',
          borderRadius: 28,
          boxShadow: '0 36px 90px rgba(11,18,32,.26)',
          overflow: 'hidden',
          color: 'var(--text)',
          maxHeight: '86vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ height: 3, background: 'linear-gradient(90deg, var(--brand), var(--accent))' }} />

      <Box sx={{ p: { xs: 2.5, sm: 3.5, md: 4 }, overflowY: 'auto', maxHeight: 'calc(86vh - 3px)', overscrollBehavior: 'contain', '&::-webkit-scrollbar': { width: 8 }, '&::-webkit-scrollbar-thumb': { background: '#B8C1D0', borderRadius: 20 }, '&::-webkit-scrollbar-track': { background: '#EEF1F6' } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" sx={{ mb: 2.6 }}>
          <Stack direction="row" spacing={1.6} alignItems="center">
            <Box sx={{ width: 52, height: 52, borderRadius: '16px', p: '3px', background: 'var(--brand-soft)' }}>
              <Box component="img" src={vaultxMark} alt="VaultX" sx={{ width: '100%', height: '100%', borderRadius: '15px' }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: { xs: 26, sm: 32 }, fontWeight: 800, color: 'var(--text)', letterSpacing: '-.055em', lineHeight: 1 }}>
                Contract registry
              </Typography>
              <Typography sx={{ mt: .7, fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: 'var(--muted)', letterSpacing: '.16em', textTransform: 'uppercase' }}>
                Configured addresses and explicit pending states
              </Typography>
            </Box>
          </Stack>

          <Button onClick={handleClose} variant="outlined" sx={{ px: 2.2 }}>
            Close
          </Button>
        </Stack>

        <Box
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: '22px',
            border: '1px solid #c8eee1',
            background: 'var(--accent-soft)',
            mb: 2.5,
          }}
        >
          <Typography sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text)', mb: .7 }}>
            Address policy
          </Typography>
          <Typography sx={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8 }}>
            Addresses appear only when configured for a supported chain. Missing token, presale, or proxy values remain visible as disabled states.
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {buildRows().map((row) => <ContractItem key={row.label} row={row} />)}
        </Stack>

        <Divider sx={{ my: 2.6, borderColor: 'var(--border)' }} />

        <Typography sx={{ color: 'var(--dim)', fontSize: 12, lineHeight: 1.75 }}>
          Local development note: the modal does not open any explorer/proxy URL. After deployment, add verified production addresses and optionally add explorer links in a controlled release.
        </Typography>
      </Box>
    </Dialog>
  );
}
