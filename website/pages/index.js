import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as React from "react";
import { ethers } from "ethers";
import abi from "./utils/BoilerplateLending.json"

export default function Home() {
  const [currAccount, setCurrentAccount] = React.useState("")
  const contractAddress = "0x57C65EB151c772b5e733D5ebe91120619a06b4e7"
  const contractABI = abi.abi

  const checkIfWalletIsThere = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('no eth XD')
    } else {
      console.log('finally, eth', ethereum);
    }

    ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        console.log(accounts)
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('we have an authorized accoutn')
          setCurrentAccount(account)
          getAllWaves()
        } else {
          console.log('user has no perms for us to use')
        }
      })
  }

  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('you probably wanna connect your wallet')
    }

    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log(accounts[0])
        setCurrentAccount(accounts[0])
      })
      .catch(err => console.warn(err))
  }

  const borrow = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const boilerplateLendingContract = new ethers.Contract(contractAddress, contractABI, signer);
    //ETHx, DAIx, USDCx, TUSDx
    //0xDD5462a7dB7856C9128Bc77Bd65c2919Ee23C6E1, 0xe3CB950Cb164a31C66e32c320A800D477019DCFF, 0x25B5cD2E6ebAedAa5E21d0ECF25A567EE9704aA7, 0xB20200908d60f1d7bc68594f677bC15070a87504

    console.log('what msg?', message)
    const borrow = await boilerplateLendingContract.borrow(_asset, _amount, _borrowedAsset, _amountBorrowed /* { gasLimit: 300000 } */)

    console.log('mining....', waveTxn.hash)
    await borrow.wait()
    console.log('Mined -- ', waveTxn.hash)
  }
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
