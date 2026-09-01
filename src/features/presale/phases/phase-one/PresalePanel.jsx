import { useEffect, useMemo, useState, Fragment } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from 'shared/components/ui/Alert';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import PRESALE_ABI from 'contracts/presale.json';
import { getChainIdFromLibrary, getContracts, getNetworkMeta, isAddress } from 'shared/config/contracts';

const STATE_LABELS = ['Pending', 'Active', 'Success', 'Failed'];
const STATE_COLORS = ['default', 'success', 'success', 'error'];

const FALLBACK_TERMS = [
  ['Contract status', 'Waiting for deployment'],
  ['Required step', 'Connect wallet first'],
  ['Token', 'VTX'],
  ['Sale actions', 'Disabled until contract is configured'],
];

const formatEth = (value) => {
  try { return Number(ethers.utils.formatEther(value || 0)).toLocaleString(undefined, { maximumFractionDigits: 4 }); }
  catch { return '0'; }
};

const formatToken = (value, decimals = 18) => {
  try { return Number(ethers.utils.formatUnits(value || 0, decimals)).toLocaleString(undefined, { maximumFractionDigits: 2 }); }
  catch { return '0'; }
};

const StatRow = ({ label, value, highlight }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.5, borderBottom: '1px solid var(--border)' }}>
    <Typography sx={{ fontSize: '12px', color: 'var(--muted)' }}>{label}</Typography>
    <Typography sx={{ fontSize: '12px', color: highlight ? 'var(--brand-deep)' : 'var(--text)', fontWeight: highlight ? 800 : 500, textAlign: 'right', maxWidth: '58%', wordBreak: 'break-all' }}>{value}</Typography>
  </Stack>
);

const SectionLabel = ({ children }) => (
  <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--brand-deep)', fontWeight: 700, mt: 3, mb: 1.5 }}>
    {children}
  </Typography>
);

const LockedPanel = ({ title, rows, children }) => (
  <Box sx={{ p: 2.4, borderRadius: '16px', background: 'var(--surface-2)', border: '1px solid var(--border)', mb: 3 }}>
    <Typography sx={{ fontFamily:'Plus Jakarta Sans, sans-serif', fontSize:18, fontWeight:800, color:'var(--text)', mb:1 }}>{title}</Typography>
    <Typography sx={{ color:'var(--muted)', fontSize:13, lineHeight:1.75, mb:2 }}>{children}</Typography>
    {rows.map(([k, v]) => <StatRow key={k} label={k} value={v} />)}
  </Box>
);

const PresalePanel = () => {
  const { account, library } = useWeb3React();
  const chainId = getChainIdFromLibrary(library);
  const network = getNetworkMeta(chainId);
  const contracts = getContracts(chainId);
  const presaleAddress = contracts.presale;
  const isConnected = Boolean(account && library);
  const hasPresaleAddress = isAddress(presaleAddress);

  const [amount, setAmount] = useState('0.1');
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [presaleError, setPresaleError] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [openAlert, setOpenAlert] = useState(false);

  const contract = useMemo(() => {
    if (!isConnected || !hasPresaleAddress) return null;
    return new ethers.Contract(presaleAddress, PRESALE_ABI, library.getSigner());
  }, [isConnected, hasPresaleAddress, presaleAddress, library]);

  const showAlert = (msg) => { setAlertMsg(msg); setOpenAlert(true); };

  const loadPresale = async () => {
    if (!isConnected || !contract) return;
    setLoading(true);
    setPresaleError('');
    try {
      const [config, metrics, tokenInfo, state, paused, position] = await Promise.all([
        contract.config(),
        contract.metrics(),
        contract.tokenInfo(),
        contract.currentState(),
        contract.paused(),
        contract.buyerPosition(account),
      ]);

      setDashboard({ config, metrics, tokenInfo, state: Number(state), paused });
      setBuyer({ ethDeposited: position.ethDeposited, vtxAllocated: position.vtxAllocated });
    } catch (err) {
      setDashboard(null);
      setBuyer(null);
      setPresaleError('Unable to read the presale contract on this network. Confirm that the configured VITE_PRESALE_ADDRESS points to the deployed VaultXPresale contract.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPresale(); }, [contract, account]);

  useEffect(() => {
    const run = async () => {
      if (!contract || !amount || Number(amount) <= 0) { setQuote(''); return; }
      try {
        const wei = ethers.utils.parseEther(String(amount));
        const quoted = await contract.quoteTokens(wei);
        const decimals = dashboard?.tokenInfo?.decimals ?? 18;
        setQuote(formatToken(quoted, decimals));
      } catch { setQuote(''); }
    };
    run();
  }, [amount, contract, dashboard]);

  const stateLabel = dashboard ? STATE_LABELS[dashboard.state] || 'Unknown' : 'Not loaded';
  const stateColor = dashboard ? STATE_COLORS[dashboard.state] || 'default' : 'default';
  const isActive = dashboard?.state === 1 && !dashboard?.paused;
  const canClaim = dashboard?.state === 2 && buyer && !buyer.vtxAllocated.isZero();
  const canRefund = dashboard?.state === 3 && buyer && !buyer.ethDeposited.isZero();
  const actionDisabled = loading || !contract || (!isActive && !canClaim && !canRefund);

  const progressPct = dashboard?.config?.hardCap?.gt(0)
    ? Math.min((Number(ethers.utils.formatEther(dashboard.metrics.totalRaisedEth)) / Number(ethers.utils.formatEther(dashboard.config.hardCap))) * 100, 100)
    : 0;

  const actionLabel = isActive ? 'Buy VTX' : canClaim ? 'Claim VTX' : canRefund ? 'Withdraw refund' : 'Action unavailable';

  const handleAction = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      let tx;
      if (isActive) {
        if (!amount || Number(amount) <= 0) throw new Error('Enter a valid ETH amount.');
        tx = await contract.deposit({ value: ethers.utils.parseEther(String(amount)) });
      } else if (canClaim) {
        tx = await contract.claimTokens();
      } else if (canRefund) {
        tx = await contract.claimRefund();
      } else {
        throw new Error('This action is not available in the current presale state.');
      }
      showAlert('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      showAlert('Transaction confirmed. Dashboard refreshed.');
      await loadPresale();
    } catch (err) {
      showAlert(err?.reason || err?.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  const tokenDecimals = dashboard?.tokenInfo?.decimals ?? 18;

  return (
    <Fragment>
      <Alert openAlert={openAlert} setOpenAlert={setOpenAlert} msg={alertMsg} />

      <Grid container spacing={3} justifyContent="center" className="fadeInUp">
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', background: '#fff', border: '1px solid var(--border-strong)' }}>
            <CardContent sx={{ p: { xs: '24px', md: '36px' } }}>
              <Stack direction={{ xs:'column', sm:'row' }} justifyContent="space-between" alignItems={{ xs:'flex-start', sm:'center' }} spacing={2} sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontSize: '25px', color: 'var(--text)', fontWeight:800, letterSpacing:'-.04em', mb: 0.4 }}>Presale execution console</Typography>
                  <Typography sx={{ fontSize: '13px', color: 'var(--muted)' }}>Frontend actions are gated by wallet, network, contract address, and Solidity state.</Typography>
                </Box>
                <Chip label={dashboard?.paused ? 'Paused' : stateLabel} color={stateColor} size="small" />
              </Stack>

              {!isConnected && (
                <LockedPanel title="Wallet required" rows={FALLBACK_TERMS}>
                  Presale, claim, refund, and balance reads are intentionally deactivated until the user connects a wallet.
                </LockedPanel>
              )}

              {isConnected && !hasPresaleAddress && (
                <LockedPanel
                  title="Presale contract not configured"
                  rows={[
                    ['Connected network', network.name],
                    ['Chain ID', chainId || 'Unknown'],
                    ['Required env', `VITE_PRESALE_ADDRESS_${chainId || 'CHAIN_ID'} or VITE_PRESALE_ADDRESS`],
                    ['Current state', 'Read-only / actions disabled'],
                  ]}
                >
                  This is the correct production behavior. The frontend should not send transactions until the deployed VaultXPresale address is configured for the connected chain.
                </LockedPanel>
              )}

              {isConnected && hasPresaleAddress && presaleError && (
                <LockedPanel
                  title="Contract read failed"
                  rows={[
                    ['Network', network.name],
                    ['Configured presale', presaleAddress],
                    ['Frontend status', 'Actions disabled'],
                  ]}
                >
                  {presaleError}
                </LockedPanel>
              )}

              {dashboard && (
                <>
                  <Box sx={{ mb: 3, p: '20px', borderRadius: '16px', background: 'var(--brand-soft)', border: '1px solid #cbd4ff' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={1.5}>
                      <Typography sx={{ fontSize: '28px', color: 'var(--gold-2)', fontWeight: 800 }}>
                        {formatEth(dashboard.metrics.totalRaisedEth)} {network.symbol}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: 'var(--muted)' }}>
                        of {formatEth(dashboard.config.hardCap)} {network.symbol} hard cap
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={progressPct} sx={{ mb: 1 }} />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '11px', color: 'var(--gold-2)' }}>{progressPct.toFixed(1)}% filled</Typography>
                      <Typography sx={{ fontSize: '11px', color: 'var(--muted)' }}>Participants: {dashboard.metrics.uniqueBuyers.toString()}</Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ mb: 3, p: '16px 20px', borderRadius: '16px', border: '1px solid rgba(228,211,169,.14)', display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography sx={{ fontSize: '12px', color: 'var(--muted)' }}>Current Rate</Typography>
                      <Typography sx={{ fontSize: '18px', color: 'var(--gold-2)', fontWeight: 800 }}>1 {network.symbol} = {formatToken(dashboard.config.ratePerEth, tokenDecimals)} VTX</Typography>
                    </Box>
                    <Box sx={{ textAlign: { xs:'left', sm:'right' } }}>
                      <Typography sx={{ fontSize: '12px', color: 'var(--muted)' }}>Contract</Typography>
                      <Typography sx={{ fontFamily:'IBM Plex Mono, monospace', fontSize: '11px', color: 'var(--text)', wordBreak:'break-all' }}>{presaleAddress}</Typography>
                    </Box>
                  </Box>

                  {isActive && (
                    <Box sx={{ mb: 3 }}>
                      <SectionLabel>You send</SectionLabel>
                      <TextField
                        fullWidth
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        type="number"
                        InputProps={{ endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: '13px', color: 'var(--muted)' }}>{network.symbol}</Typography></InputAdornment> }}
                        sx={{ mb: 1.5 }}
                      />
                      <SectionLabel>You receive</SectionLabel>
                      <TextField
                        fullWidth
                        value={quote}
                        InputProps={{ readOnly: true, endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: '13px', color: 'var(--gold-2)' }}>VTX</Typography></InputAdornment> }}
                      />
                    </Box>
                  )}

                  <Button fullWidth variant="contained" size="large" disabled={actionDisabled} onClick={handleAction} sx={{ fontSize: '15px', fontWeight: 800, py: 1.8, mb: 3 }}>
                    {loading ? 'Loading...' : actionLabel}
                  </Button>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <SectionLabel>Token Information</SectionLabel>
                      <StatRow label="Token Name" value={dashboard.tokenInfo.name} />
                      <StatRow label="Symbol" value={dashboard.tokenInfo.symbol} highlight />
                      <StatRow label="Decimals" value={String(tokenDecimals)} />
                      <StatRow label="Total Supply" value={`${formatToken(dashboard.tokenInfo.totalSupply, tokenDecimals)} VTX`} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SectionLabel>Your Position</SectionLabel>
                      <StatRow label="Your Investment" value={`${formatEth(buyer?.ethDeposited)} ${network.symbol}`} highlight />
                      <StatRow label="Your VTX Allocation" value={`${formatToken(buyer?.vtxAllocated, tokenDecimals)} VTX`} highlight />
                      <StatRow label="Min Contribution" value={`${formatEth(dashboard.config.minContribution)} ${network.symbol}`} />
                      <StatRow label="Max Per Wallet" value={`${formatEth(dashboard.config.maxContribution)} ${network.symbol}`} />
                    </Grid>
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default PresalePanel;
