import './shared/lib/warningFilter';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app/App';
import './styles/global.css';
import { MoralisDappProvider } from 'providers/MoralisDappProvider/MoralisDappProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { MoralisProvider } from 'react-moralis';

const APP_ID = import.meta.env.VITE_MORALIS_APP_ID || '';
const SERVER_URL = import.meta.env.VITE_MORALIS_SERVER_URL || '';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#F3F5F9', paper: '#FFFFFF' },
    primary:    { main: '#3658F5', dark: '#243DB6' },
    secondary:  { main: '#18A982' },
    success:    { main: '#18A982' },
    warning:    { main: '#DF8A2F' },
    error:      { main: '#CF5660' },
    text:       { primary: '#111827', secondary: '#5F6879' },
    divider:    '#DDE2EB',
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: { styleOverrides: '' },
    MuiButton: {
      styleOverrides: {
        root: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, textTransform: 'none', borderRadius: 12 },
      },
    },
  },
});

const getLibrary = (provider) => {
  const lib = new ethers.providers.Web3Provider(provider);
  lib.pollingInterval = 12000;
  return lib;
};

const Application = () => (
  <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL} initializeOnMount={!!(APP_ID && SERVER_URL)}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <MoralisDappProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <App/>
        </ThemeProvider>
      </MoralisDappProvider>
    </Web3ReactProvider>
  </MoralisProvider>
);

ReactDOM.render(<Application/>, document.getElementById('root'));
