import PresalePanel from './PresalePanel';

// The Solidity contract is now the source of truth for sale timing and state.
// The frontend should not rely on a hard-coded countdown timestamp.
const PhaseOne = () => <PresalePanel />;

export default PhaseOne;
