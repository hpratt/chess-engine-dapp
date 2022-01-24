import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from './connectors';

export function useEagerConnect() {
    
    const { activate, active } = useWeb3React();
    const [ tried, setTried ] = useState(false);

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized: boolean) => {
            if (isAuthorized)
                activate(injected, undefined, true).catch(() => {
                    setTried(true);
                });
            else
                setTried(true);
        });
    });

    useEffect(() => {
        if (!tried && active) setTried(true);
    }, [ tried, active ])

    return tried;

}

export function useInactiveListener(suppress: boolean = false) {
    const { active, error, activate } = useWeb3React();
    useEffect((): any => {
        const { ethereum } = window as any;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                activate(injected);
            };
            const handleChainChanged = (_: string | number) => {
                activate(injected);
            }
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) activate(injected);
            }
            const handleNetworkChanged = (_: string | number) => {
                activate(injected);
            }
            ethereum.on('connect', handleConnect)
            ethereum.on('chainChanged', handleChainChanged)
            ethereum.on('accountsChanged', handleAccountsChanged)
            ethereum.on('networkChanged', handleNetworkChanged)
            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('connect', handleConnect)
                    ethereum.removeListener('chainChanged', handleChainChanged)
                    ethereum.removeListener('accountsChanged', handleAccountsChanged)
                    ethereum.removeListener('networkChanged', handleNetworkChanged)
                }
            };
        }
    }, [ active, error, suppress, activate ]);
}
