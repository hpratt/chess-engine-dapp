import { useEffect, useState } from "react";

export type WorkerpoolOrderResponse = {
    count: number;
    ok: boolean;
    orders: {
        chainId: number;
        order: {
            apprestrict: string;
            category: number;
            datasetrestrict: string;
            requesterrestrict: string;
            salt: string;
            sign: string;
            tag: string;
            trust: number;
            volume: number;
            workerpool: string;
            workerpoolprice: number;
        };
        orderHash: string;
        publicationTimestamp: string;
        remaining: number;
        signer: string;
        status: string;
    }[];
};

export function useWorkerpoolOrders(chainId: number, category: number = 0): [ WorkerpoolOrderResponse | null, string | null ] {
    const [ orders, setOrders ] = useState<WorkerpoolOrderResponse | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    useEffect(() => {
        if (!chainId) return;
        fetch(`https://v7.api.market.iex.ec/workerpoolorders?category=${category}&chainId=${chainId}&minTag=0x0000000000000000000000000000000000000000000000000000000000000000`)
            .then(x => x.json()).then(setOrders).catch(setError);
    }, [ chainId, category ]);
    return [ orders, error ];
}
