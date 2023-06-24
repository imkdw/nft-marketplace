import styled from "styled-components";
import { Connect } from "./components/Connect";
import { WalletStatus } from "./components/WalletStatus";
import { SignMessage } from "./components/SignMessage";
import { ContractCall } from "./components/ContractCall";

const AppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

export default function App() {
  return (
    <AppDiv>
      <Connect />
      <WalletStatus />
      <SignMessage />
      <ContractCall />
    </AppDiv>
  );
}
