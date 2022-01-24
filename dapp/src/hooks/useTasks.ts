import { useEffect, useState } from "react"
import iexecW from "iexec";

type TaskResponse = {
    count: number;
    ok: boolean;
    tasks: {
        beneficiary: string;
        blockNumber: number;
        chainId: number;
        status: string;
        taskid: string;
    }[];
};

type SingleTaskResponse = {
    consensusValue: string;
    dealid: string;
    results: {
        storage: string;
        location: string;
    };
    resultsCallback: string;
    status: number;
    statusName: string;
    taskTimedOut: boolean;
    taskid: string;
};

export function useTasks(dealid?: string, chainId?: number) {
    const [ tasks, setTasks ] = useState<TaskResponse | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    useEffect(() => {
        if (!chainId || !dealid) return;
        fetch("https://v7.gateway.iex.ec/tasks", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                limit: 100,
                saveCount: true,
                chainId,
                find: { dealid }
            })
        }).then(x => x.json()).then(setTasks).catch(setError);
    }, [ chainId ]);
    return [ tasks, error ];
}

export function useTask(taskId: string): [ SingleTaskResponse | null, string | null ] {
    const [ task, setTask ] = useState<SingleTaskResponse | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    useEffect( () => {
        const iexec = new iexecW.IExec({ ethProvider: (window as any).ethereum });
        iexec.task.show(taskId).then(setTask).catch(setError);
    }, [ taskId ]);
    return [ task, error ];
};
