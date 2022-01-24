import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import iexecW from "iexec";

import { CHESS_ENGINE_APP } from "./useDeals";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";

export function useOrderMatch(ethProvider: Web3ReactContextInterface<Web3Provider>, params?: string, category: number = 0) {

    const { account } = ethProvider;
    const [ dealId, setDealId ] = useState<string | null>(null);
    const [ error, setError ] = useState<string | null>(null);

    useEffect( () => {

        if (!account) return;

        new Promise<string>( async (resolve, reject) => {

            const iexec = new iexecW.IExec({ ethProvider: (window as any).ethereum });

            iexec.orderbook.fetchAppOrderbook(CHESS_ENGINE_APP).then((x: any) => console.log("$$", x));
            const { orders } = await iexec.orderbook.fetchAppOrderbook(CHESS_ENGINE_APP);
            const appOrder = orders && orders[0] && orders[0].order;
            if (!appOrder) {
                reject(`no apporder found for app ${CHESS_ENGINE_APP}`);
                return;
            }

            const { orders: wOrders } = await iexec.orderbook.fetchWorkerpoolOrderbook({ category });
            const workerpoolOrder = wOrders && wOrders[0] && wOrders[0].order;
            if (!workerpoolOrder) {
                reject(`no workerpoolorder found for category ${category}`);
                return;
            }

            if (!await iexec.storage.checkStorageTokenExists(account)) {
                const defaultStorageToken = await iexec.storage.defaultStorageLogin();
                const { isPushed } = await iexec.storage.pushStorageToken(defaultStorageToken);
                if (!isPushed) {
                    reject("unable to initialize IPFS storage for results");
                    return;
                }
            }

            const requestOrderToSign = await iexec.order.createRequestorder({
                app: CHESS_ENGINE_APP,
                appmaxprice: appOrder.appprice,
                workerpoolmaxprice: workerpoolOrder.workerpoolprice,
                requester: account,
                volume: 1,
                params: params || "",
                category: category
            });
            const requestOrder = await iexec.order.signRequestorder(requestOrderToSign);
        
            const res = await iexec.order.matchOrders({
                apporder: appOrder,
                requestorder: requestOrder,
                workerpoolorder: workerpoolOrder
            });

            console.log(res);
            resolve(res.dealid as string);

        }).then(setDealId).catch(setError);

    }, [ params, category, account ]);

    return [ dealId, error ];

}
