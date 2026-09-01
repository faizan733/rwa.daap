import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import CopyToClipboard from 'shared/components/common/CopyToClipboard.jsx';
import { getEllipsisTxt } from 'helpers/formatters.js';
import { getExplorer } from 'helpers/networks.js';
import { useWalletConnector } from './WalletConnector.jsx';

const resetLocalStorage = () => {
  localStorage.removeItem('wallet');
  localStorage.removeItem('connected');
};

const AccountDetails = ({ accountDetailsDialogOpen, handleAccountDetailsDialogToggle, data }) => {
  const { logoutWalletConnector } = useWalletConnector();

  const handleLogout = () => {
    logoutWalletConnector();
    handleAccountDetailsDialogToggle();
    resetLocalStorage();
  };

  const Row = ({ label, children }) => (
    <Box sx={{ py: 1.5, borderBottom: '1px solid var(--border)' }}>
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '8px', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--dim)', mb: 0.75 }}>
        {label}
      </Typography>
      {children}
    </Box>
  );

  return (
    <Dialog
      open={accountDetailsDialogOpen}
      onClose={handleAccountDetailsDialogToggle}
      BackdropProps={{ style: { backgroundColor: 'rgba(11,18,32,0.52)' } }}
      fullWidth maxWidth="xs"
    >
      <Box sx={{ height: 3, background: 'linear-gradient(90deg, #3658F5, #18A982)' }} />

      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '22px', fontWeight: 800, color: 'var(--text)' }}>
              My Wallet
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', color: '#0b7658', letterSpacing: '0.1em' }}>
                Connected
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleAccountDetailsDialogToggle} sx={{ color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '10px', width: 34, height: 34, '&:hover': { color: 'var(--text)', borderColor: 'var(--border-strong)' } }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Row label="Address">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Link
              href={`${getExplorer(data.chainId)}/address/${data.account}`}
              underline="none"
              target="_blank"
              rel="noreferrer"
              sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--brand-deep)', '&:hover': { color: 'var(--brand)' } }}
            >
              {getEllipsisTxt(data.account, 8)}
            </Link>
            <CopyToClipboard text={data.account} />
          </Stack>
        </Row>

        <Row label="ETH Balance">
          <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '26px', fontWeight: 800, color: 'var(--text)' }}>
            {data.balance} <Box component="span" sx={{ fontSize: '14px', color: 'var(--brand-deep)' }}>ETH</Box>
          </Typography>
        </Row>
      </DialogContent>

      <DialogActions>
        <Button
          fullWidth
          startIcon={<LogoutIcon sx={{ fontSize: '14px !important' }} />}
          onClick={handleLogout}
          sx={{
            border: '1px solid rgba(224,92,92,0.25)',
            color: '#e05c5c',
            borderRadius: '8px',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '10px', letterSpacing: '0.1em',
            py: 1.2,
            '&:hover': { background: 'rgba(224,92,92,0.08)', borderColor: 'rgba(224,92,92,0.5)' },
          }}
        >
          Disconnect Wallet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountDetails;
