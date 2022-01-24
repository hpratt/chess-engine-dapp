import React from 'react';

import { Tabs, Tab, Typography, Button, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { TabPanel } from '../TabPanel';
import { a11yProps } from '../TabPanel/TabPanel';

type MoveProgressionProps = {
    onForward?: () => void;
    onBack?: () => void;
    onMoveSelected?: (ply: string, index: number) => void;
    onSelect?: (index: number) => void;
    onTabSelected?: (index: number) => void;
    startingPosition?: string;
    evaluation?: string;
    highlightedMove?: number;
    engines: string[];
    selectedTab: number;
    moves?: string | string[];
    blackToPlay?: boolean;
    title?: string;
};

const MoveProgressionComponent: React.FC<MoveProgressionProps> = props => {

    const moves = props.moves instanceof Array ? props.moves.join(" ") : props.moves;
    const needsNumberLabels = (moves?.split(" ").filter(x => x.endsWith(".")).length || 0) === 0;

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={props.selectedTab}
                    onChange={(_, v) => props.onTabSelected && props.onTabSelected(v)}
                >
                    { props.engines.map((engine, i) => (
                        <Tab label={engine} value={i} key={engine} {...a11yProps(i)} />
                    )) }
                </Tabs>
            </Box>
            { props.engines.sort().map((_, i) => (
                <TabPanel value={i} index={props.selectedTab}>
                    { props.children }
                    { props.startingPosition && (
                        <>
                            <Typography component="h6" variant="h6" color="textPrimary">
                                <strong>Starting Position</strong>
                            </Typography>
                            <Typography
                                component="span"
                                style={{ cursor: "pointer", backgroundColor: props.highlightedMove === 0 ? "#dddddd" : undefined }}
                                onClick={() => props.onMoveSelected && props.onMoveSelected("", 0)}
                            >
                                {props.startingPosition}
                            </Typography><br /><br />
                            <Divider /><br />
                        </>
                    )}
                    { props.evaluation && (
                        <>
                            <Typography component="h6" variant="h6" color="textPrimary">
                                <strong>Evaluation</strong>
                            </Typography>
                            {props.evaluation}<br /><br />
                            <Divider /><br />
                        </>
                    )}
                    <Typography component="h6" variant="h6" color="textPrimary">
                        <strong>{ props.title || "Recommended Continuation" }</strong>
                    </Typography>
                    { needsNumberLabels && moves && props.blackToPlay && (
                        <Typography
                            component="span"
                            padding={1}
                            style={{ cursor: "pointer", backgroundColor: props.highlightedMove === 1 ? "#dddddd" : undefined }}
                            onClick={() => props.onMoveSelected && props.onMoveSelected(moves[0], 1)}
                        >
                            c1.{props.blackToPlay ? ".." : ""}
                        </Typography>
                    )}
                    { moves?.split(" ").map((ply, i) => (
                        <>
                            { needsNumberLabels && i % 2 === (props.blackToPlay ? 1 : 0) && (
                                <Typography
                                    component="span"
                                    padding={1}
                                    style={{ cursor: "pointer", backgroundColor: props.highlightedMove === i + 1 ? "#dddddd" : undefined }}
                                    onClick={() => props.onMoveSelected && props.onMoveSelected(ply, i + 1)}
                                >
                                    c{Math.floor((i + 1) / 2) + 1}.
                                </Typography>
                            )}
                            <Typography
                                onClick={() => props.onMoveSelected && props.onMoveSelected(ply, i + 1)}
                                component="span"
                                padding={1}
                                style={{ cursor: "pointer", backgroundColor: props.highlightedMove === i + 1 ? "#dddddd" : undefined }}
                            >
                                {ply}
                            </Typography>
                            { (needsNumberLabels ? (i % 6 === 5) : (i % 8 === 7)) ? <br /> : null }
                        </>
                    )) }<br /><br />
                    <Button onClick={props.onBack} variant="contained">‹</Button>
                    <Button onClick={props.onForward} variant="contained">›</Button>
                </TabPanel>
            )) }
        </>
    );

};
export default MoveProgressionComponent;
