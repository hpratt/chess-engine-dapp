/**
 * Homepage.tsx: homepage component.
 * The homepage displays a simple grid with the two primary services available in the app: analysis and
 * engine vs. engine games.
 */


import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { AppBar } from '../AppBar';
import analysis from '../../images/analysis.png';
import engine from '../../images/engine-vs-engine.png';

const Homepage: React.FC = () => (
    <>
        <AppBar />
        <Grid container spacing={3}>
            <Grid item xs={12} />
            <Grid item xs={3} />
            <Grid item xs={6}>
                <Typography component="h2" variant="h3" align="center" color="textPrimary">
                    dChess on iExec
                </Typography>
                <Typography component="h2" variant="h5" align="center" color="textPrimary" gutterBottom>
                    Analyze a position or have two engines play each other from a custom opening:
                </Typography>
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={4} />
            <Grid item xs={2}>
                <Card>
                    <Link to="/evaluate">
                        <CardMedia
                            component="img"
                            image={analysis}
                            alt="analysis"
                            style={{ width: "100%" }}
                        />
                    </Link>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" align="center">Position Analysis</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={2}>
                <Card>
                    <Link to="/engine-game">
                        <CardMedia
                            component="img"
                            image={engine}
                            alt="engine game"
                            style={{ width: "100%" }}
                        />
                    </Link>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" align="center">Engine vs. Engine</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4} />
        </Grid>
    </>
 );
 export default Homepage;
