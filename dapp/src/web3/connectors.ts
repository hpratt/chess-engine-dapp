import { InjectedConnector } from '@web3-react/injected-connector';
import { PortisConnector } from '@web3-react/portis-connector';

export const injected = new InjectedConnector({ supportedChainIds: [ 1, 3, 4, 5, 42, 133 ] });
export const portis = new PortisConnector({ dAppId: process.env.PORTIS_DAPP_ID as string, networks: [ 1, 100 ] });
