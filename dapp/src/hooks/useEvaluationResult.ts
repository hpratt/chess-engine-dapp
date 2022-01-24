/**
 * useEvaluationResult.ts: loads an evaluation result from a ZIP archive on IPFS.
 */


import { useState, useEffect } from "react";
import JSZip from 'jszip';

/**
 * Fetches an evaluation result object from an iExec task ZIP archive on IPFS.
 * @param path the IPFS path to the object.
 * @returns an EvaluationObject or an error string.
 */
export function useTaskResult<T>(path?: string): [ T | null, string | null ] {
    const [ result, setResult ] = useState<T | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    useEffect(() => {
        if (!path) return;
        fetch(`https://ipfs.iex.ec/ipfs/${path}`)
            .then(x => x.arrayBuffer())
            .then(x => new JSZip().loadAsync(x))
            .then(x => x.files["results.json"]?.async("string"))
            .then(x => setResult(JSON.parse(x || "{}")))
            .catch(setError);
    }, [ path ]);
    return [ result as T, error ];
}
