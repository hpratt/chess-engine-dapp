/**
 * AppBar.tsx: header bar with wallet login connector.
 */


import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, Button, Typography, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import WalletConnectorButton from './WalletConnectorButton';

const ApplicationAppBar: React.FC = () => {

    const navigate = useNavigate();

    const { account, chainId } = useWeb3React<Web3Provider>();
    const [ menuOpen, setMenuOpen ] = useState(false);
    const anchor = useRef(null);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                />
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                    onClick={() => { navigate("/"); }}
                    style={{ cursor: "pointer" }}
                >
                    dChess on iExec
                </Typography>
                { account ? (
                    <>
                        <Avatar ref={anchor} onClick={() => setMenuOpen(true)}>Ξ</Avatar>
                        <Typography marginLeft={1}>{account.slice(0, 5)}...{account.slice(account.length - 4)}</Typography>
                        <Menu
                            id="account"
                            anchorEl={anchor.current}
                            open={menuOpen}
                            onClose={() => setMenuOpen(false)}
                            MenuListProps={{
                                'aria-labelledby': 'lock-button',
                                role: 'listbox',
                            }}
                        >
                            <MenuItem disabled>Current Chain: {chainId}</MenuItem>
                            <Divider />
                            <MenuItem onClick={() => navigate("/account")}>My Previous Tasks</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <WalletConnectorButton>
                        <Button color="inherit">
                            Connect Wallet
                        </Button>
                    </WalletConnectorButton>
                )}
                </Toolbar>
            </AppBar>
        </Box>
    );

};
export default ApplicationAppBar;
