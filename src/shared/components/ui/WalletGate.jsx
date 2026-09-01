import { useWeb3React } from '@web3-react/core';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Account from 'features/wallet/WalletAccount';
import { getChainIdFromLibrary, getNetworkMeta } from 'shared/config/contracts';

export default function WalletGate({ title, description, children, requireWallet = true }) {
  const { account, library } = useWeb3React();
  const connected = Boolean(account && library);
  const chainId = getChainIdFromLibrary(library);
  const network = getNetworkMeta(chainId);

  if (!requireWallet || connected) {
    return (
      <Box>
        {connected && (
          <Box sx={{ mb: 2.5, p: 2, borderRadius: '15px', background: 'var(--accent-soft)', border: '1px solid #c8eee1' }}>
            <Stack direction={{ xs:'column', sm:'row' }} spacing={1.2} justifyContent="space-between" alignItems={{ xs:'flex-start', sm:'center' }}>
              <Box>
                <Typography sx={{ fontFamily:'IBM Plex Mono, monospace', fontSize:9, letterSpacing:'.13em', color:'#0b7658', textTransform:'uppercase' }}>Wallet connected</Typography>
                <Typography sx={{ mt:.5, color:'var(--muted)', fontSize:13 }}>Network: {network.name}</Typography>
              </Box>
              <Typography sx={{ fontFamily:'IBM Plex Mono, monospace', fontSize:10, color:'var(--brand-deep)', wordBreak:'break-all' }}>{account}</Typography>
            </Stack>
          </Box>
        )}
        {children}
      </Box>
    );
  }

  return (
    <Box className="vx-card-strong" sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
      <Box sx={{ width: 70, height: 70, borderRadius: '20px', mx: 'auto', mb: 2.5, display:'grid', placeItems:'center', background:'var(--brand-soft)', border:'1px solid #cbd4ff' }}>
        <Typography sx={{ fontSize: 28, color:'var(--brand-deep)' }}>◎</Typography>
      </Box>
      <Typography sx={{ fontFamily:'Plus Jakarta Sans, sans-serif', fontSize:{ xs: 28, md: 34 }, fontWeight:800, color:'var(--text)', letterSpacing:'-.045em' }}>
        {title || 'Connect wallet to continue'}
      </Typography>
      <Typography sx={{ color:'var(--muted)', lineHeight:1.8, mt:1.5, mb:3, maxWidth:620, mx:'auto' }}>
        {description || 'This feature is disabled until your wallet is connected. Connect a browser wallet first, then the contract panel and actions will become available.'}
      </Typography>
      <Box sx={{ display:'flex', justifyContent:'center' }}>
        <Account />
      </Box>
    </Box>
  );
}
