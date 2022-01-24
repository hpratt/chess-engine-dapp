/**
 * TaskResultPage.tsx: presents results from a Chess engine evaluation or engine vs. engine game
 * task performed on iExec.
 */


import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Alert, CircularProgress, Typography } from '@mui/material';

import EvaluationBoard from '../Board/EvaluationBoard';
import EngineGameBoard from '../Board/EngineGameBoard';
import { AppBar } from '../AppBar';
import { useTask } from '../../hooks/useTasks';
import { useTaskResult } from '../../hooks/useEvaluationResult';
import { EngineGameOutput, EvaluationOutput } from '../Board/types';

const EvaluationResult: React.FC<{ path: string }> = ({ path }) => {
    const [ evaluationResult, error ] = useTaskResult<EvaluationOutput>(path);
    return evaluationResult && Object.keys(evaluationResult || {}).length > 0 ? (
        <EvaluationBoard {...evaluationResult} />
    ) : error ? (
        <Alert severity="error">
            There was an error loading results from IPFS path <strong>{path}</strong>:<br />
            {error}
        </Alert>
    ) : (
        <CircularProgress />
    );
}

const EngineGameResult: React.FC<{ path: string }> = ({ path }) => {
    const [ engineGameResult, error ] = useTaskResult<EngineGameOutput>(path);
    return engineGameResult && Object.keys(engineGameResult || {}).length > 0 ? (
        <EngineGameBoard {...engineGameResult} />
    ) : error ? (
        <Alert severity="error">
            There was an error loading results from IPFS path <strong>{path}</strong>:<br />
            {error}
        </Alert>
    ) : (
        <CircularProgress />
    );
}

const TaskResultPage: React.FC<{ type: "engine-game" | "evaluation" }> = ({ type }) => {

    const p = useParams<{ task: string }>();
    const [ task, error ] = useTask(p.task || "");
    const C = type === "engine-game" ? EngineGameResult : EvaluationResult;

    return (
        <>
            <AppBar />
            <Grid container>
                <Grid xs={12} />
                <Grid xs={12}>
                    { task ? (
                        task.statusName === "COMPLETED" ? (
                            <>
                                <Grid item xs={12} alignItems="center">
                                    <br />
                                    <Typography component="h2" variant="h5" align="center" color="textPrimary">
                                        {type === "engine-game" ? "Engine vs. Engine Game" : "Position Analysis"} for Task <strong>{p.task}</strong>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <C path={task.results.location.split("/")[task.results.location.split("/").length - 1]} />
                                </Grid>
                            </>
                        ) : task.statusName === "FAILED" ? (
                            <Alert severity='error'>
                                Task {task.taskid} failed. For more information, check the iExec explorer.
                            </Alert>
                        ) : (
                            <Alert severity="info">
                                Task {task.taskid} appears to still be in progress. Check this page later for results.
                            </Alert>
                        )
                    ) : error ? (
                        <Alert severity="error">
                            There was an error loading task <strong>{p.task}</strong>:<br />
                            {error}
                        </Alert>
                    ) : <CircularProgress />}
                </Grid>
            </Grid>
        </>
    );

}
export default TaskResultPage;
