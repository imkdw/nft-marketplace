import { useState, useEffect, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";

// web3Connect를 진행하고 커넥트 여부를 반환
export function useWeb3Connect(): boolean {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  // 이미 활성화 여부 검사
  const tryActivate = useCallback(() => {
    async function _tryActivate() {
      const isAutorized = await injected.isAuthorized();

      if (isAutorized) {
        try {
          await activate(injected, undefined, tried);
        } catch (error: any) {
          window.alert(`Error : ${error && error.message}`);
        }
      }
      setTried(true);
    }
    _tryActivate();
  }, [activate]);

  useEffect(() => {
    tryActivate();
  }, [tryActivate]);

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

// 현재 이더리움 상태에 따라 연결하거나 체인을 바꾸거나 등 이벤트를 감지
// 이를 web3 react-lib와 연동하는 작업
/**
 * @param suppress 외부에서 관리하는 변수
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const ethereum = (window as any).ethereum;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("handle Connected");
        activate(injected);
      };

      const handleChainChanged = (chainId: string) => {
        console.log("chain changed", chainId);
        activate(injected);
      };

      const handleAccountsChanged = (accounts: string | string[]) => {
        console.log("accounts changed");
        if (accounts.length > 0) activate(injected);
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}
