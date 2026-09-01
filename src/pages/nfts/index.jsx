import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NFTBalance from 'shared/components/NFTBalance';
import WalletGate from 'shared/components/ui/WalletGate';
import { brandImages } from 'assets/remoteImages';

export default function NFTs() {
  return (
    <Box className="vx-page" sx={{ minHeight:'100vh', pt:4, pb:10 }}>
      <Container maxWidth="xl">
        <Box className="vx-hero" sx={{ position:'relative', overflow:'hidden', borderRadius:'24px', p:{ xs:3, md:5 }, mb:4 }}>
          <Box component="img" src={brandImages.galleryHero} alt="" sx={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:.72 }} />
          <Box sx={{ position:'absolute', inset:0, background:'linear-gradient(100deg, rgba(8,19,17,.58) 36%, rgba(8,19,17,.20) 100%)' }} />
          <Box sx={{ position:'relative' }}>
            <Box className="vx-eyebrow" sx={{ mb:2 }}>Tokenized assets</Box>
            <Typography sx={{ fontFamily:'Plus Jakarta Sans, sans-serif', fontSize:{ xs:38, md:58 }, fontWeight:800, letterSpacing:'-.055em', lineHeight:1, color:'#fff' }}>Your RWA NFT holdings</Typography>
            <Typography sx={{ mt:2, maxWidth:560, color:'#b9c3d7', lineHeight:1.75, fontSize:13 }}>View configured asset-token holdings for the connected wallet and inspect their associated metadata.</Typography>
          </Box>
        </Box>
        <Box className="vx-card" sx={{ p:{ xs:2, md:3 } }}>
          <WalletGate title="Connect wallet to view holdings" description="NFT holdings are wallet-specific, so this module stays inactive until a wallet is connected."><NFTBalance /></WalletGate>
        </Box>
      </Container>
    </Box>
  );
}
