/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/control-panel
 */

import React, { memo, useContext, useLayoutEffect } from "react";
import { ControlPanelRootContext } from "../ControlPanel";

import PopupOptions from "../global/state/PopupOptions";
import useRecoilStateObject from "../hooks/use-recoil-state-object";

import PopupComponent, { popupComponentState } from "./PopupComponent";

/**
 * React component to handle render errors.
 */
export default memo((props: { error: any }) => {
    const { locale } = useContext(ControlPanelRootContext);
    const { setState: setPopup } = useRecoilStateObject(popupComponentState);

    useLayoutEffect(() => {
        locale && setPopup(PopupOptions.moduleCriticalFailure(
            props.error.message || String(props.error),
            locale.popup.ModuleCriticalFailure
        ));
    }, [ props.error ]);

    return <PopupComponent />;
});
