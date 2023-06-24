import { useWeb3React } from "@web3-react/core";
import { useState, MouseEvent, useEffect, ChangeEvent } from "react";
import { Contract, ethers } from "ethers";
import GreetingArtifact from "../artifacts/contracts/Greeting.sol/Greeting.json";

export function ContractCall() {
  const { active, library } = useWeb3React();
  const [signer, setSigner] = useState();
  const [greetingContract, setGreetingContract] = useState<Contract>();
  const [greetingContractAddr, setGreetingContractAddr] = useState("");
  const [greeting, setGreeting] = useState("");
  const [greetingInput, setGreetingInput] = useState("");

  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect(() => {
    if (!greetingContract) return;

    const getGreeting = async (greetingContract: Contract) => {
      try {
        const _greeting = await greetingContract.greet();
        if (_greeting !== greeting) {
          setGreeting(_greeting);
        }
      } catch (err) {
        console.error(`greet() 호출 오류: ${err}`);
      }
    };

    getGreeting(greetingContract);
  }, [greetingContract, greeting]);

  const handleDeployContract = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (greetingContract) return;

    const deployGreetingContract = async () => {
      // 컨트랙트 구성
      const Greeting = new ethers.ContractFactory(GreetingArtifact.abi, GreetingArtifact.bytecode, signer);

      // 컨트랙트 배포
      try {
        const greetingContract = await Greeting.deploy("Hello Noob zz");
        await greetingContract.deployed();

        const greeting = await greetingContract.greet();
        setGreetingContract(greetingContract);
        setGreeting(greeting);
        setGreetingContractAddr(greetingContract.address);
        window.alert(`Greeting deployed to ${greetingContract.address}`);
      } catch (err: any) {
        window.alert(`Error: ${err && err.message ? err.message : ""}`);
      }
    };

    deployGreetingContract();
  };

  const handleGreetingChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { value } = event.currentTarget;
    setGreetingInput(value);
  };

  const handleGreetingSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    const submitGreeting = async (greetingContract: Contract) => {
      try {
        const setGreetingTxn = await greetingContract.setGreeting(greetingInput);
        await setGreetingTxn.wait();

        const newGreeting = await greetingContract.greet();
        setGreetingInput(newGreeting);
        window.alert(`Success : ${newGreeting}`);
      } catch (err: any) {}
    };

    if (greetingContract) submitGreeting(greetingContract);
  };

  return (
    <>
      <button disabled={!active || greetingContract ? true : false} onClick={handleDeployContract}>
        Deploy Greeting Contract
      </button>
      <div>
        <span>Contract Address : </span>
        <span>{greetingContractAddr ? greetingContractAddr : "컨트랙트가 아직 배포되지 않았음"}</span>
      </div>
      <div>Greeting: {greeting ? JSON.stringify(greeting) : <>Contract not yet Deployed</>}</div>
      <div>
        <label htmlFor="greetingInput">Set new Greeting : </label>
        <input
          type="text"
          id="greetingInput"
          placeholder={greeting ? greeting : ""}
          onChange={handleGreetingChange}
          value={greetingInput}
        />
        <button disabled={!active || !greetingContract ? true : false} onClick={handleGreetingSubmit}>
          asd
        </button>
      </div>
    </>
  );
}
