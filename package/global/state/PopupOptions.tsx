/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { RefreshIcon } from "@heroicons/react/outline";
import { ExclamationCircleIcon, ShieldExclamationIcon } from "@heroicons/react/solid";
import React from "react";
import { IPopupState } from "../../components/PopupComponent/PopupComponent";
import ControlPanelLocale from "../LocaleTypes";
import StateLocale = ControlPanelLocale.ICommonPopupStatesLocale;

/**
 * List of common popup states.
 */

export default {
    authenticationFailure: (callback: () => void, locale: StateLocale["AuthenticationFailure"]): IPopupState => ({
        open: true,
        title: locale.title,
        titleIcon: <ShieldExclamationIcon />,
        textContent: locale.textContent,
        buttons: [
            {
                children: locale.buttonLabel,
                icon: <RefreshIcon />,
                onClick: callback
            }
        ]
    }),

    moduleCriticalFailure: (error: string, locale: StateLocale["AuthenticationFailure"]): IPopupState => ({
        open: true,
        title: locale.title,
        titleIcon: <ExclamationCircleIcon />,
        textContent: locale.textContent,

        hintContent: error,
        buttons: [
            {
                children: locale.buttonLabel,
                icon: <RefreshIcon />,
                onClick: () => window.location.reload()
            }
        ]
    })
};
