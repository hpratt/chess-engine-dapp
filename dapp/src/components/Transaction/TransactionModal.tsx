import { Web3Provider } from '@ethersproject/providers';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderMatch } from '../../hooks/useTransaction';
import { useWorkerpoolOrders } from '../../hooks/useWorkerpoolOrders';

type TransactionModalProps = {
    title: string;
    onClose?: () => void;
    params: string;
};

const Transactor: React.FC<{ params: string, ethProvider: Web3ReactContextInterface<Web3Provider> }> = props => {
    const navigate = useNavigate();
    const dealId = useOrderMatch(props.ethProvider, props.params);
    useEffect( () => { dealId[0] && navigate(`/deal/${dealId[0]}`) }, [ dealId, navigate ]);
    return <div />;
}

const TransactionModal: React.FC<TransactionModalProps> = props => {
    
    const [ confirmed, setConfirmed ] = useState(false);
    const ethProvider = useWeb3React<Web3Provider>();
    const { chainId } = ethProvider;
    const preliminaryOrders = useWorkerpoolOrders(chainId || 1);

    return (
        <Dialog open onClose={props.onClose}>
            { confirmed && (
                <Transactor params={props.params} ethProvider={ethProvider} />
            )}
            { confirmed ? (
                <>
                    <DialogTitle>
                        Placing order...
                    </DialogTitle>
                    <DialogContent>
                        <CircularProgress /><br />
                        Use your wallet interface to complete the transaction. This page will redirect automatically when the transaction is confirmed.
                    </DialogContent>
                </>
            ) : preliminaryOrders[0] ? (
                <>
                    <DialogTitle>
                        Confirm your Order
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            A market order for <strong>{props.title}</strong> will be placed with the following parameters:<br />
                            <pre>{props.params.replace(/--/g, "\\\n    --")}</pre>
                        </DialogContentText>
                        <DialogContentText>
                            Current chain ID: <strong>{chainId}</strong><br />
                            Open workerpool orders: <strong>{preliminaryOrders[0].count}</strong><br />
                            Estimated price: <strong>{Math.min(...preliminaryOrders[0].orders.map(x => x.order.workerpoolprice)) / 1000000000.0} RLC</strong>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={props.onClose}>
                            Cancel
                        </Button>
                        <Button onClick={() => setConfirmed(true)}>Confirm</Button>
                    </DialogActions>
                </>
            ) : preliminaryOrders[1] ? (
                <>
                    <DialogTitle>
                        Error Loading Orders
                    </DialogTitle>
                    <DialogContent>
                        We were unable to load orders from the iExec marketplace. Please check your connection and try again.
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={props.onClose}>
                            OK
                        </Button>
                    </DialogActions>
                </>
            ) : (
                <>
                    <DialogTitle>
                        Confirm your Order
                    </DialogTitle>
                    <DialogContent>
                        <CircularProgress />
                        Loading orders...
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={props.onClose}>
                            Cancel
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );

};
export default TransactionModal;
