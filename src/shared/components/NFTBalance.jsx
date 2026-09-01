import React, { useState, Fragment } from 'react';
import { useMoralis, useNFTBalances } from 'react-moralis';
import Typography from '@mui/material/Typography';
import placeholderToken from 'assets/images/placeholder.svg';
import { useMoralisDapp } from 'providers/MoralisDappProvider/MoralisDappProvider';
import { getExplorer } from 'helpers/networks';
import AddressInput from './AddressInput';
import { CartIcon, FileSearchIcon, IconAction, SendIcon, SimpleInput, SimpleModal } from './ui/NoAntd';

function NFTBalance() {
  const { data: NFTBalances } = useNFTBalances();
  const { chainId, walletAddress } = useMoralisDapp();
  const { Moralis } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [amountToSend, setAmount] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [isPending, setIsPending] = useState(false);

  async function transfer(nft, amount, receiver) {
    if (!nft) return;

    const options = {
      type: nft.contract_type.toLowerCase(),
      tokenId: nft.token_id,
      receiver,
      contractAddress: nft.token_address,
    };

    if (options.type === 'erc1155') {
      options.amount = amount;
    }

    console.log('option', options);

    setIsPending(true);
    await Moralis.transfer(options)
      .then(() => {
        setIsPending(false);
        setVisibility(false);
      })
      .catch((e) => {
        console.log(e);
        setIsPending(false);
      });
  }

  const handleTransferClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const nftCardStyle = {
    width: 240,
    border: '2px solid #e7eaf3',
    borderRadius: 16,
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
  };

  return (
    <Fragment>
      {!NFTBalances?.result || NFTBalances?.result.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          You do not have NFTs
        </Typography>
      ) : (
        NFTBalances.result.map((nft, index) => (
          <div style={nftCardStyle} key={`${nft.token_address}-${nft.token_id || index}`}>
            <img
              src={nft?.image || placeholderToken}
              onError={(event) => {
                event.currentTarget.src = placeholderToken;
              }}
              alt={nft?.name || 'NFT image'}
              style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block', background: '#f8fafc' }}
            />
            <div style={{ padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 6 }}>
                {nft.name || 'Untitled NFT'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', wordBreak: 'break-all' }}>
                {nft.token_address}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: 8, padding: 12, borderTop: '1px solid rgba(148, 163, 184, 0.24)' }}>
              <IconAction title="View On Blockexplorer" onClick={() => window.open(`${getExplorer(chainId)}address/${walletAddress}`, '_blank')}>
                <FileSearchIcon />
              </IconAction>
              <IconAction title="Transfer NFT" onClick={() => handleTransferClick(nft)}>
                <SendIcon />
              </IconAction>
              <IconAction title="Sell On OpenSea" onClick={() => alert('OPENSEA INTEGRATION COMING!')}>
                <CartIcon />
              </IconAction>
            </div>
          </div>
        ))
      )}
      <SimpleModal
        title={`Transfer ${nftToSend?.name || 'NFT'}`}
        open={visible}
        onCancel={() => setVisibility(false)}
        onOk={() => transfer(nftToSend, amountToSend, receiverToSend)}
        confirmLoading={isPending}
        okText="Send"
      >
        <AddressInput autoFocus placeholder="Receiver" onChange={setReceiver} />
        {nftToSend && nftToSend.contract_type === 'erc1155' && (
          <SimpleInput placeholder="amount to send" onChange={(e) => handleChange(e)} />
        )}
      </SimpleModal>
    </Fragment>
  );
}

export default NFTBalance;
