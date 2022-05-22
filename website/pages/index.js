import * as React from "react";
import { ethers } from "ethers";
import abi from "./utils/BoilerplateLending.json"
import Button from './components/Button';

const Collaterals = Object.freeze({
  ETHx: "0xDD5462a7dB7856C9128Bc77Bd65c2919Ee23C6E1",
  DAIx: "0xe3CB950Cb164a31C66e32c320A800D477019DCFF",
  USDCx: "0x25B5cD2E6ebAedAa5E21d0ECF25A567EE9704aA7",
  TUSDx: "0xB20200908d60f1d7bc68594f677bC15070a87504"
});

export default function Home() {
  const inputStyle = {
    height: 30,
    width: 300
  };

  const [currAccount, setCurrentAccount] = React.useState("");
  const [collateral, setCollateral] = React.useState(Collaterals.ETHx);
  const [collateralAmount, setCollateralAmount] = React.useState(null);
  const [borrowableTokens, setBorrowableTokens] = React.useState(Collaterals.ETHx);
  const [amountBorrowing, setAmountBorrowing] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const contractAddress = "0x57C65EB151c772b5e733D5ebe91120619a06b4e7";
  const contractABI = abi.abi;

  const checkIfWalletIsThere = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('no eth XD')
    } else {
      console.log('finally, eth', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts)
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('we have an authorized accoutn')
      setCurrentAccount(account)
    } else {
      console.log('user has no perms for us to use')
    }
  }

  const connectWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('you probably wanna connect your wallet')
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log(accounts[0])
      setCurrentAccount(accounts[0])
      setIsConnected(true);
    } catch (error) {
      console.warn(error)
    }
  }

  const borrow = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const boilerplateLendingContract = new ethers.Contract(contractAddress, contractABI, signer);

    const response = await boilerplateLendingContract.borrow(collateral, BigInt(collateralAmount * 1000000000000000000), borrowableTokens, BigInt(amountBorrowing * 1000000000000000000), { gasLimit: 300000 })

    console.log('mining....', response.hash)
    await borrow.wait()
    console.log('Mined -- ', response.hash)
  }

  React.useEffect(() => {
    checkIfWalletIsThere();
  }, []);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{
          width: '100%',
          textAlign: 'center'
        }}>Hack Money</h1>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 10
      }}> <Button style={{ height: 40 }} onClick={connectWallet}>Connect Wallet</Button></div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
        gap: 5
      }} >
        <div>
          <label>Collateral: </label>
          <select value={collateral} onChange={(x) => setCollateral(x.target.value)}>
            <option value={Collaterals.ETHx}>ETHx</option>
            <option value={Collaterals.DAIx}>DAIx</option>
            <option value={Collaterals.USDCx}>USDCx</option>
            <option value={Collaterals.TUSDx}>TUSDx</option>
          </select>
        </div>

        <div>
          <label>Collateral Amount: </label>
          <input type="number" style={inputStyle} value={collateralAmount} onChange={(event) => setCollateralAmount(event.target.value)} />
        </div>

        <div> <label>Borrowable Tokens: </label>
          <select value={borrowableTokens} onChange={(x) => setBorrowableTokens(x.target.value)}>
            <option value={Collaterals.ETHx}>ETHx</option>
            <option value={Collaterals.DAIx}>DAIx</option>
            <option value={Collaterals.USDCx}>USDCx</option>
            <option value={Collaterals.TUSDx}>TUSDx</option>
          </select>
        </div>

        <div>
          <label>Amount Borrowing: </label>
          <input type="number" style={inputStyle} value={amountBorrowing} onChange={(event) => setAmountBorrowing(event.target.value)} />
        </div>
        {!isConnected && <Button style={{ height: 40 }} onClick={borrow}>Borrow</Button>}
      </div>
    </div >
  )
}
