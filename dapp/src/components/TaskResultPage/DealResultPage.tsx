/**
 * TaskResultPage.tsx: presents results from a Chess engine evaluation or engine vs. engine game
 * task performed on iExec.
 */


import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, Grid } from '@mui/material';
import iexecW from "iexec";

import { AppBar } from '../AppBar';
import { useDeal } from '../../hooks/useDeals';
import { Alert } from '@material-ui/lab';
 
const DealResultPage: React.FC = () => {
 
    const p = useParams<{ deal: string }>();
    const [ deal, error ] = useDeal(p.deal || "");
    const navigate = useNavigate();
    useEffect( () => {
        if (deal?.tasks.length === 1) {
            const params = JSON.parse(deal.params)["iexec_args"] as string;
            const iexec = new iexecW.IExec({ ethProvider: (window as any).ethereum });
            const i = setInterval(() => {
                iexec.task.show(deal.tasks[0]).then(() => {
                    navigate(`/${params.split(" ")[0]}/${deal.tasks[0]}`);
                    clearInterval(i);
                }).catch(() => {})
            },  3000);
        }
    }, [ deal, navigate ]);

    return (
        <>
            <AppBar />
            <Grid container alignItems="center">
                <Grid xs={12} />
                <Grid xs={12}>
                    { error ? (
                        <Alert severity="error">
                            There was an error loading deal <strong>{p.deal}</strong>:<br />
                            {error}
                        </Alert>
                    ) : (
                        <>
                            <CircularProgress /><br />
                            Loading deal data for <strong>{p.deal}</strong>...
                        </>
                    )}
                </Grid>
            </Grid>
        </>
    );

}
export default DealResultPage;
 