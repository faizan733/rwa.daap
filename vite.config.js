import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig(async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_URL || '/';
  const plugins = [react()];

  if (command === 'build') {
    const { nodePolyfills } = await import('vite-plugin-node-polyfills');
    plugins.push(
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      }),
    );
  }

  return {
    base,

    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT || 5173),
      strictPort: false,
      open: true,
      cors: true,
      allowedHosts: true,
      hmr: {
        clientPort: Number(env.VITE_HMR_CLIENT_PORT || 443),
      },
    },

    preview: {
      host: '0.0.0.0',
      port: Number(env.VITE_PREVIEW_PORT || 4173),
      strictPort: false,
      allowedHosts: true,
    },

    plugins,

    define: {
      'process.env': {
        VITE_DCL_DEFAULT_ENV: env.VITE_DCL_DEFAULT_ENV,
        VITE_BASE_URL: base,
      },
      global: 'globalThis',
    },

    resolve: {
      alias: {
        '@web3-react/core': fileURLToPath(new URL('./src/shared/lib/web3/Web3ReactCompat.jsx', import.meta.url)),
        'react-moralis': fileURLToPath(new URL('./src/shared/lib/web3/ReactMoralisCompat.jsx', import.meta.url)),
        'react-dom/client': fileURLToPath(new URL('./src/shared/lib/web3/ReactDomClientCompat.jsx', import.meta.url)),

        app: fileURLToPath(new URL('./src/app', import.meta.url)),
        assets: fileURLToPath(new URL('./src/shared/assets', import.meta.url)),
        features: fileURLToPath(new URL('./src/features', import.meta.url)),
        pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
        shared: fileURLToPath(new URL('./src/shared', import.meta.url)),
        components: fileURLToPath(new URL('./src/shared/components', import.meta.url)),
        contracts: fileURLToPath(new URL('./src/contracts/abis', import.meta.url)),
        helpers: fileURLToPath(new URL('./src/shared/lib/helpers', import.meta.url)),
        hooks: fileURLToPath(new URL('./src/shared/lib/hooks', import.meta.url)),
        providers: fileURLToPath(new URL('./src/shared/providers', import.meta.url)),
      },
    },

    build: {
      sourcemap: false,
    },
  };
});
