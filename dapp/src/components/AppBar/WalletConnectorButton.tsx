import React from 'react';

import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { useEagerConnect, useInactiveListener } from '../../web3/hooks';
import { injected } from '../../web3/connectors';

const WalletConnectorButton: React.FC = props => {

    const { connector, activate } = useWeb3React<Web3Provider>();
    const [ activatingConnector, setActivatingConnector ] = React.useState<AbstractConnector>();
    React.useEffect(() => {
        if (activatingConnector && activatingConnector === connector) setActivatingConnector(undefined);
    }, [ activatingConnector, connector ]);
    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager || !!activatingConnector);

    return (
        <div
            onClick={() => { if (!injected) return; setActivatingConnector(injected); activate(injected); }}
        >
            {props.children}
        </div>
    );

};
export default WalletConnectorButton;
