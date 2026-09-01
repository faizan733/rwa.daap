import placeholderToken from 'assets/images/placeholder.svg';
import { useMoralis } from 'react-moralis';
import { useERC20Balance } from 'hooks/useERC20Balance';
import { SimpleSkeleton, SimpleTable } from './ui/NoAntd';
import { getEllipsisTxt } from 'helpers/formatters';
import Container from '@mui/material/Container';

const styles = {
  title: {
    fontSize: '30px',
    fontWeight: '700',
  },
};
function ERC20Balance(props) {
  const { assets } = useERC20Balance(props);
  const { Moralis } = useMoralis();

  const columns = [
    {
      title: '',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo) => (
        <img
          src={logo || placeholderToken}
          alt="nologo"
          width="28px"
          height="28px"
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => name,
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol) => symbol,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (value, item) => parseFloat(Moralis.Units.FromWei(value, item.decimals).toFixed(6)),
    },
    {
      title: 'Address',
      dataIndex: 'token_address',
      key: 'token_address',
      render: (address) => getEllipsisTxt(address, 5),
    },
  ];

  return (
    <Container>
      <h1 style={styles.title}>💰Token Balances</h1>
      <SimpleSkeleton loading={!assets}>
        <SimpleTable
          dataSource={assets}
          columns={columns}
          rowKey={(record) => {
            return record.token_address;
          }}
        />
      </SimpleSkeleton>
    </Container>
  );
}
export default ERC20Balance;
