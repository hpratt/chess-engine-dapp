/**
 * useDeals.ts: hook for fetching deals matching a given account.
 */


import { useEffect, useState } from "react";
import iexecW from "iexec";

export const CHESS_ENGINE_APP = "0x32eC55788E7502f2420fF9C67Df9751E2a2D94B2";

export type Deal = {
    app: { pointer: string; };
    blockNumber: number;
    blockTimestamp: string;
    dealid: string;
    params: string;
    requester: string;
};

type DealListResponse = {
    count: number;
    deals: Deal[];
};

type DealResponse = {
    app: {
        pointer: string;
        owner: string;
    };
    beneficiary: string;
    callback: string;
    dataset: {
        pointer: string;
        owner: string;
    };
    deadlineReached: boolean;
    dealid: string;
    params: string;
    requester: string;
    tag: string;
    tasks: string[];
    workerpool: {
        pointer: string;
        owner: string;
    };
};

export function useDeals(account?: string, chainId?: number): [ DealListResponse | null, string | null ] {
    const [ deals, setDeals ] = useState<DealListResponse | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    useEffect(() => {
        if (!chainId) return;
        fetch("https://v7.gateway.iex.ec/deals", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                limit: 100,
                saveCount: true,
                chainId,
                find: { "$or": [{ requester: account }, { beneficiary: account }] }
            })
        }).then(x => x.json()).then((x: DealListResponse) => setDeals({
            ...x,
            deals: x.deals.filter(xx => xx.app.pointer === CHESS_ENGINE_APP)
        })).catch(setError);
    }, [ chainId, account ]);
    return [ deals, error ];
}

export function useDeal(dealId: string): [ DealResponse | null, string | null ] {
    const [ deal, setDeal ] = useState<DealResponse | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    useEffect( () => {
        const iexec = new iexecW.IExec({ ethProvider: (window as any).ethereum });
        iexec.deal.show(dealId).then(setDeal).catch(setError);
    }, [ dealId ]);
    return [ deal, error ];
};
