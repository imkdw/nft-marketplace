import { useWeb3React } from "@web3-react/core";
import { MouseEvent } from "react";
import styled from "styled-components";

const Button = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export function SignMessage() {
  const { account, active, library } = useWeb3React();

  const handleSignMessage = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!library || !account) {
      window.alert("지갑 연결 실패");
      return;
    }

    const signMessage = async () => {
      try {
        const signature = await library.getSigner(account).signMessage("Hello Fastcampus");
        window.alert(`Success :${signature}`);
      } catch (err) {
        console.error(err);
      }
    };

    signMessage();
  };

  return (
    <Button
      disabled={!active ? true : false}
      onClick={handleSignMessage}
      style={{ borderColor: !active ? "unset" : "blue" }}
    >
      Sign Message
    </Button>
  );
}
