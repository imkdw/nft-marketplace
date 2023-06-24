import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { useState, MouseEvent } from "react";
import { injected } from "../utils/connectors";
import { useInactiveListener, useWeb3Connect } from "../utils/hooks";
import styled from "styled-components";

const ActivateButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: green;
  cursor: pointer;
`;

const DeActivateButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: red;
  cursor: pointer;
`;

function Activate() {
  const context = useWeb3React();
  const { activate, active } = context;
  const [activating, setActivating] = useState(false);

  const handleActivate = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const _activate = async () => {
      setActivating(true);
      await activate(injected);
      setActivating(false);
    };
    _activate();
  };

  const eagerConnectionSuccessful = useWeb3Connect();
  useInactiveListener(!eagerConnectionSuccessful);

  return (
    <ActivateButton
      disabled={active}
      onClick={handleActivate}
      style={{ borderColor: activating ? "orange" : active ? "unset" : "green" }}
    >
      Connect
    </ActivateButton>
  );
}

function DeActivate() {
  const context = useWeb3React();
  const { deactivate, active } = context;

  const handleDeActivate = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    deactivate();
  };

  return (
    <DeActivateButton disabled={!active} onClick={handleDeActivate} style={{ borderColor: active ? "red" : "unset" }}>
      Disconnect
    </DeActivateButton>
  );
}

function getErrMsg(error: any) {
  let errMsg: string;

  switch (error.constructor) {
    // case :
    //   errMsg = '브라우저에서 이더리움 확장프로그램이 발견되지 않음. 메타마스크를 설치하세요';
    //   break;
    case UnsupportedChainIdError:
      errMsg = "지원하지 않는 네트워크에 연결되어 있습니다.";
      break;
    // case 'c':
    //   errMsg = '이더리움 계정을 해당 웹사이트에 인증해주세요'
    default:
      errMsg = error.message;
  }

  return errMsg;
}
export function Connect() {
  const { error } = useWeb3React();

  if (error) {
    window.alert(getErrMsg(error));
  }
  return (
    <>
      <Activate />
      <DeActivate />
    </>
  );
}
