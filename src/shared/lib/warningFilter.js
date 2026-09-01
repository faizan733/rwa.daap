/*
 * VaultX console warning filter
 *
 * Filters known non-breaking browser wallet warnings during local development:
 * - MetaMask EIP-1193 deprecation warnings surfaced through injected wallets
 *
 * This filter hides only those exact noisy dependency warnings. It does not
 * suppress application errors or unknown warnings.
 */
const KNOWN_NOISY_WARNINGS = [
  /React Router Future Flag Warning/i,
  /React Router will begin wrapping state updates in `React\.startTransition` in v7/i,
  /Relative route resolution within Splat routes is changing in v7/i,
  /MetaMask: The event 'close' is deprecated/i,
  /MetaMask: The event 'networkChanged' is deprecated/i,
  /MetaMask: 'ethereum\.send\(\.\.\.\)' is deprecated/i,
  /Please use 'disconnect' instead/i,
  /Use 'chainChanged' instead/i,
  /Please use 'ethereum\.sendAsync\(\.\.\.\)' or 'ethereum\.request\(\.\.\.\)' instead/i,
];

function shouldHideConsoleMessage(args) {
  const message = args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return arg.message;
      try { return JSON.stringify(arg); } catch { return String(arg); }
    })
    .join(' ');

  return KNOWN_NOISY_WARNINGS.some((pattern) => pattern.test(message));
}

const originalWarn = console.warn.bind(console);
console.warn = (...args) => {
  if (shouldHideConsoleMessage(args)) return;
  originalWarn(...args);
};
