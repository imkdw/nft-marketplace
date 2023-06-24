import { Web3Provider } from "@ethersproject/providers";

/** Web3 인스턴스를 가져와서 Index.tsx에서 Web3ReactProvider에 전달해줌 */
export function getProvider(provider: any) {
  const web3Provider = new Web3Provider(provider);
  web3Provider.pollingInterval = 1000;
  return web3Provider;
}
