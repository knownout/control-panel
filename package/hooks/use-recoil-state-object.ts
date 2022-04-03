/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { RecoilState, SetterOrUpdater, useRecoilState } from "recoil";

/**
 * Hook for converting state value and setter to the object to more comfortable usage.
 */
export default function useRecoilStateObject<T> (recoilState: RecoilState<T>) {
    const [ state, _setState ] = useRecoilState(recoilState) as [ T, SetterOrUpdater<T> ];

    const setState = (dispatcher: ((state: T) => Partial<T>) | Partial<T>) => _setState(state => {
        const nextState = typeof dispatcher === "function" ? dispatcher(state) : dispatcher;
        if (typeof nextState === "object") return Object.assign({}, state, nextState);
        else return nextState;
    });

    return { state, setState };
}
