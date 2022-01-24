import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert, CircularProgress, Grid, Typography, Divider } from '@mui/material';

import { Deal, useDeals } from '../../hooks/useDeals';
import { AppBar } from '../AppBar';

const DenseTable: React.FC<{ data: Deal[] }> = ({ data }) => (
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Block Timestamp</TableCell>
                    <TableCell align="right">Type</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { data.map( row => (
                    <TableRow
                        key={row.dealid}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            <Link to={`/deal/${row.dealid}`}>{row.dealid}</Link>
                        </TableCell>
                        <TableCell align="right">{new Date(row.blockTimestamp).toLocaleString()}</TableCell>
                        <TableCell align="right">
                            { JSON.parse(row.params)["iexec_args"].split(" ")[0] === "evaluate" ? "Position Evaluation" : "Engine vs. Engine Game" }
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

const AccountPage: React.FC = () => {

    const { account, chainId } = useWeb3React<Web3Provider>();
    const [ deals, error ] = useDeals(account || undefined, chainId || undefined);

    return (
        <>
            <AppBar />
            <Grid container padding={2}>
                <Grid item xs={12} />
                <Grid item xs={2} />
                <Grid item xs={8} alignItems="center">
                    <Typography component="h2" variant="h5" align="center" color="textPrimary">
                        Previously executed tasks for account <strong>{account}</strong>:
                    </Typography>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={12} />
                <Grid item xs={2} />
                <Grid item xs={8} alignItems="center">
                    <br />
                    <Divider />
                    <br />
                    { error ? (
                        <Alert severity="error">
                            There was an error loading deals for account <strong>{account}</strong> on chain {chainId}. Please check your connection and try again.
                        </Alert>
                    ) : deals === null ? (
                        <>
                            <CircularProgress /><br />
                            Loading deals for {account} on chain {chainId}...
                        </>
                    ) : deals.count === 0 ? (
                        <Alert severity="info">
                            No deals were found for account <strong>{account}</strong> on chain {chainId}. Click the header at the top left to return to the main page
                            to start analysis, or use your wallet interface to switch chains.
                        </Alert>
                    ) : (
                        <DenseTable data={deals.deals} />
                    )}
                </Grid>
            </Grid>
        </>
    );

}
export default AccountPage;
