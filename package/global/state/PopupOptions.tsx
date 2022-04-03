/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { RefreshIcon } from "@heroicons/react/outline";
import {
    AcademicCapIcon, AdjustmentsIcon, ExclamationCircleIcon, EyeIcon, InformationCircleIcon, LockClosedIcon,
    QuestionMarkCircleIcon, ShieldExclamationIcon, TerminalIcon, XIcon
} from "@heroicons/react/solid";
import { Button } from "@knownout/interface";
import React from "react";
import { IPopupState } from "../../components/PopupComponent";
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
        content: locale.textContent,
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
        content: locale.textContent,

        hintContent: error,
        buttons: [
            {
                children: locale.buttonLabel,
                icon: <RefreshIcon />,
                onClick: () => window.location.reload()
            }
        ]
    }),

    welcomeMessage: (callback: (notShow: boolean) => void, locale: StateLocale["WelcomeMessage"]) => ({
        open: true,
        className: "welcome-message",

        content: [
            <span className="text center">
                { <InformationCircleIcon /> }
                { locale.versionLabel } - 1.0.0-rc.1
            </span>,

            <span className="text">
                { locale.moduleDescription }
            </span>,

            <div className="buttons">
                <Button icon={ <EyeIcon /> }>{ locale.aboutModuleButton }</Button>
                <Button icon={ <QuestionMarkCircleIcon /> }>{ locale.faqButton }</Button>
                <Button icon={ <AdjustmentsIcon /> }>{ locale.extensionsButton }</Button>
                <Button icon={ <TerminalIcon /> }>{ locale.developersButton }</Button>
            </div>,

            <span className="text">
                { <AcademicCapIcon /> } { locale.appearHint }
            </span>
        ],
        buttons: [
            {
                children: locale.closeAndNotShowButton, icon: <LockClosedIcon />,
                onClick: () => callback(true)
            },

            { children: locale.closeButton, icon: <XIcon />, onClick: () => callback(false) }
        ],
        title: locale.title
    })
};
