/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { loaderComponentState } from "../components/LoaderComponent";

// States container
const waitingStates = new Set<string>();

(window as any).waitingStates = waitingStates;
/**
 * A loader component state add-on that allows multiple components to initiate
 * loading at the same time and ensure that the loading state
 * does not change as long as at least one component is loaded.
 *
 * _Use startLoading and finishLoading shortcuts for more clean code._
 *
 * @return loading state and state updaters
 */
export default function useLoadingState () {
    type TState = { key: string, loading: boolean };

    const [ loading, _setLoading ] = useRecoilState(loaderComponentState);

    const setLoading = useCallback((state: TState) => {
        if (!state.loading) waitingStates.delete(state.key);
        else waitingStates.add(state.key);

        // Set loading to false only if there is no more loading components.
        if (waitingStates.size == 0) _setLoading(false);
        else _setLoading(true);

    }, []);

    const startLoading = (key: string) => setLoading({ key, loading: true });

    const finishLoading = (key: string) => setLoading({ key, loading: false });

    return { loading, setLoading, startLoading, finishLoading };
}
