import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import MintCard from 'features/mint/MintCard';
import WalletGate from 'shared/components/ui/WalletGate';
import { brandImages } from 'assets/remoteImages';

export default function Mint() {
  return (
    <Box className="vx-page" sx={{ minHeight:'100vh', pt:4, pb:10 }}>
      <Container maxWidth="xl">
        <Box className="vx-hero" sx={{ position:'relative', overflow:'hidden', borderRadius:'24px', p:{ xs:3, md:5 }, mb:4 }}>
          <Box component="img" src={brandImages.mint} alt="" sx={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:.72 }} />
          <Box sx={{ position:'absolute', inset:0, background:'linear-gradient(100deg, rgba(8,19,17,.58) 36%, rgba(8,19,17,.20) 100%)' }} />
          <Box sx={{ position:'relative' }}>
            <Box className="vx-eyebrow" sx={{ mb:2 }}>Asset minting</Box>
            <Typography sx={{ fontFamily:'Plus Jakarta Sans, sans-serif', fontSize:{ xs:38, md:58 }, fontWeight:800, letterSpacing:'-.055em', lineHeight:1, color:'#fff' }}>Mint configured asset tokens</Typography>
            <Typography sx={{ mt:2, maxWidth:560, color:'#b9c3d7', lineHeight:1.75, fontSize:13 }}>Minting remains unavailable until the wallet, network, asset metadata, contract address, and issuance permissions are verified.</Typography>
          </Box>
        </Box>
        <Box className="vx-card" sx={{ p:{ xs:2, md:4 } }}>
          <Typography sx={{ fontFamily:'Plus Jakarta Sans, sans-serif', fontWeight:800, mb:3, textAlign:'center', fontSize:24, color:'var(--brand-deep)' }}>Issuance console</Typography>
          <WalletGate title="Connect wallet to mint" description="Minting is disabled until your wallet is connected. This prevents users from opening token/NFT functions before the account context is ready."><MintCard /></WalletGate>
        </Box>
      </Container>
    </Box>
  );
}
