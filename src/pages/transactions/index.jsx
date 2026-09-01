import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ERC20Transfers from 'features/transactions/ERC20Transfers';
import WalletGate from 'shared/components/ui/WalletGate';
import { brandImages } from 'assets/remoteImages';

export default function Transactions() {
  return (
    <Box className="vx-page" sx={{ minHeight:'100vh', pt:4, pb:10 }}>
      <Container maxWidth="xl">
        <Box className="vx-hero" sx={{ position:'relative', overflow:'hidden', borderRadius:'24px', p:{ xs:3, md:5 }, mb:4 }}>
          <Box component="img" src={brandImages.transactions} alt="" sx={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:.72 }} />
          <Box sx={{ position:'absolute', inset:0, background:'linear-gradient(100deg, rgba(8,19,17,.58) 36%, rgba(8,19,17,.20) 100%)' }} />
          <Box sx={{ position:'relative', zIndex:1 }}>
            <Typography className="mono" sx={{ color:'#c8d2ff', letterSpacing:'.16em', textTransform:'uppercase', fontSize:'9px' }}>Account activity</Typography>
            <Typography sx={{ fontFamily:'Plus Jakarta Sans, sans-serif', fontSize:{ xs:38, md:58 }, fontWeight:800, letterSpacing:'-.055em', lineHeight:1, color:'#fff', mt:1 }}>Wallet transactions</Typography>
            <Typography sx={{ mt:2, maxWidth:560, color:'#b9c3d7', lineHeight:1.75, fontSize:13 }}>Review indexed ERC-20 activity for the connected wallet and open each transaction in the relevant explorer.</Typography>
          </Box>
        </Box>
        <Box className="vx-card" sx={{ p:{ xs:2, md:3 } }}>
          <WalletGate title="Connect wallet to load transactions" description="Transaction history is account-specific and remains disabled until a wallet is connected."><ERC20Transfers /></WalletGate>
        </Box>
      </Container>
    </Box>
  );
}
