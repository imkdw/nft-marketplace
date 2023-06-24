import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import styled from "styled-components";

const WallsetStatusDiv = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
`;

function ChainId() {
  const { chainId } = useWeb3React();
  return (
    <div>
      <span>Chain Id : </span>
      <span>{chainId}</span>
    </div>
  );
}

function BlockNumber() {
  const { chainId, library } = useWeb3React();
  const [blockNumber, setBlockNumber] = useState();

  useEffect(() => {
    if (!library) return;
    let stale = false;
    const getBlockNumber = async () => {
      try {
        const blockNumber = await library.getBlockNumber();
        if (!stale) {
          setBlockNumber(blockNumber);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getBlockNumber();
    library.on("block", setBlockNumber);

    return () => {
      stale = true;
      library.removeListener("block", setBlockNumber);
      setBlockNumber(undefined);
    };
  }, [library, chainId]);

  return (
    <div>
      <span>Block Number : </span>
      <span>{blockNumber}</span>
    </div>
  );
}

function Account() {
  const { account } = useWeb3React();

  return (
    <div>
      <span>Account : </span>
      <span>{account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ""}</span>
    </div>
  );
}

function Balance() {
  const { account, library, chainId } = useWeb3React();
  const [balance, setBalance] = useState();

  let stale = false;
  useEffect(() => {
    if (typeof account === "undefined" || account === null || !library) return;

    const getBalance = async () => {
      try {
        const balance = await library.getBalance(account);
        if (!stale) {
          setBalance(balance);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getBalance();

    library.on("block", getBalance);

    return () => {
      stale = true;
      library.removeListener("block", getBalance);
      setBalance(undefined);
    };
  }, [account, library, chainId]);

  return (
    <div>
      <span>Balance : </span>
      <span>{balance ? `${ethers.utils.formatEther(balance)} ETH` : ""}</span>
    </div>
  );
}

function NextNonce() {
  const { account, library, chainId } = useWeb3React();
  const [nextNonce, setNextNonce] = useState();
  let stale = false;
  useEffect(() => {
    if (typeof account === "undefined" || account === null || !library) return;

    const getNextNonce = async () => {
      try {
        const nextNonce = await library.getTransactionCount(account);
        if (!stale) {
          setNextNonce(nextNonce);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getNextNonce();
  }, [account, library, chainId]);

  return (
    <div>
      <span>NextNonce : </span>
      <span>{nextNonce ? nextNonce : ""}</span>
    </div>
  );
}

export function WalletStatus() {
  return (
    <WallsetStatusDiv>
      <ChainId />
      <BlockNumber />
      <Account />
      <Balance />
      <NextNonce />
    </WallsetStatusDiv>
  );
}
