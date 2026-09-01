const VaultXToken = artifacts.require('VaultXToken');
const VaultXPresale = artifacts.require('VaultXPresale');

module.exports = async function deploy(deployer, network, accounts) {
  const owner = accounts[0];

  // 1. Deploy presale first because the token constructor sends the presale
  // allocation directly to the presale contract address.
  await deployer.deploy(VaultXPresale);
  const presale = await VaultXPresale.deployed();
  console.log('✅ VaultXPresale deployed at:', presale.address);

  // 2. Deploy VTX token and route allocations. Replace these wallet defaults
  // with real treasury wallets before production deployment.
  await deployer.deploy(
    VaultXToken,
    presale.address, // presale allocation wallet
    owner,           // DEX/liquidity reserve
    owner,           // CEX reserve
    owner,           // staking reserve
    owner,           // team reserve
    owner,           // ecosystem reserve
    owner,           // customer rewards reserve
    owner            // airdrop reserve
  );
  const token = await VaultXToken.deployed();
  console.log('✅ VaultXToken deployed at:', token.address);

  // 3. Initialize presale after token deployment.
  const RATE = web3.utils.toWei('2000000', 'ether'); // VTX units per ETH, 18 decimals
  const MIN_CONTRIBUTION = web3.utils.toWei('0.05', 'ether');
  const MAX_CONTRIBUTION = web3.utils.toWei('5', 'ether');
  const SOFT_CAP = web3.utils.toWei('50', 'ether');
  const HARD_CAP = web3.utils.toWei('100', 'ether');
  const START_TIME = Math.floor(Date.now() / 1000) + 600;
  const END_TIME = START_TIME + 30 * 24 * 60 * 60;

  await presale.initialize(
    token.address,
    RATE,
    MIN_CONTRIBUTION,
    MAX_CONTRIBUTION,
    SOFT_CAP,
    HARD_CAP,
    START_TIME,
    END_TIME
  );
  console.log('✅ VaultXPresale initialized for token:', token.address);
};
