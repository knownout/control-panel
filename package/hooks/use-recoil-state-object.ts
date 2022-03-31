/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/control-panel
 */

import { RecoilState, SetterOrUpdater, useRecoilState } from "recoil";

/**
 * Function for converting state value and setter to the object to more comfortable usage.
 * @param {RecoilState} recoilState
 * @return {{setState: SetterOrUpdater, state: SetterOrUpdater}}
 */
export default function useRecoilStateObject<T> (recoilState: RecoilState<T>) {
    const [ state, setState ] = useRecoilState(recoilState) as [ T, SetterOrUpdater<T> ];
    return { state, setState };
}
