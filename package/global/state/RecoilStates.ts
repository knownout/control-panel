/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { atom } from "recoil";
import { TCommonObject } from "../ExtensionTypes";

interface IControlPanelRootState
{
    objectsType: string;

    objectsPreview: TCommonObject[];

    selectedObject?: TCommonObject;
}

export const controlPanelRootState = atom<IControlPanelRootState>({
    key: "ControlPanelRootState.default",
    default: {
        objectsType: "materials",

        objectsPreview: [],

        selectedObject: undefined
    }
});
