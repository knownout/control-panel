/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { CacheController } from "@knownout/lib";

import React, { useContext, useLayoutEffect } from "react";

import { ControlPanelRootContext } from "../../ControlPanel";

import CacheControllerKeys from "../../global/CacheControllerKeys";
import { IControlPanelExtension } from "../../global/ExtensionTypes";
import PopupOptions from "../../global/state/PopupOptions";

import useRecoilStateObject from "../../hooks/use-recoil-state-object";

import { popupComponentState } from "../PopupComponent";

const cacheController = {
    session: new CacheController(sessionStorage),
    local: new CacheController(localStorage)
};
/**
 * Show welcome message popup at first login or
 * after browser restart.
 * @internal
 */
export default function useWelcomeMessage (extension?: IControlPanelExtension<any, any>) {
    const { extensions, authenticator, locale } = useContext(ControlPanelRootContext);
    const { setState: setPopupState, state } = useRecoilStateObject(popupComponentState);

    useLayoutEffect(() => {
        // Check if welcome message required.
        const welcomeMessage = !(cacheController.session.getItem<boolean>(CacheControllerKeys.welcomeMessage) ||
            cacheController.local.getItem<boolean>(CacheControllerKeys.welcomeMessage));

        // Check if context is not available.
        const errorCondition = !extensions || !extension || !authenticator;
        const errorMessage = !extensions || !extension ? "Can not find selected extension"
            : "Can not find control panel context";

        errorCondition && locale && setPopupState(PopupOptions.moduleCriticalFailure(
            errorMessage, locale.popup.ModuleCriticalFailure
        ));

        if (!welcomeMessage || !authenticator) return;

        // Show welcome popup.
        locale && setPopupState(PopupOptions.welcomeMessage(notShow => {
            (notShow ? localStorage : sessionStorage).setItem(CacheControllerKeys.welcomeMessage, "true");
            setPopupState({ open: false });
            console.log(state);
        }, locale.popup.WelcomeMessage));
    }, []);
}
