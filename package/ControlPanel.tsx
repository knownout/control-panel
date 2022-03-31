/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/control-panel
 */

import { classNames, limitNumber } from "@knownout/lib";

import React, { createContext, ForwardedRef, forwardRef, memo, useLayoutEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AuthenticationComponent from "./components/AuthenticationComponent";
import ErrorBoundary from "./components/ErrorBoundary";
import FallbackComponent from "./components/FallbackComponent";
import LoaderComponent, { loaderComponentState } from "./components/LoaderComponent";
import PopupComponent, { popupComponentState } from "./components/PopupComponent";
import ToastComponent from "./components/ToastComponent/ToastComponent";
import "./ControlPanel.scss";
import { IControlPanelAuthenticator } from "./global/AuthenticationTypes";
import { IControlPanelExtension, IControlPanelScreenExtension } from "./global/ExtensionTypes";
import ControlPanelLocale from "./global/LocaleTypes";
import PopupOptions from "./global/state/PopupOptions";
import useExtensionsObject from "./hooks/use-extensions-object";
import useInitialAuthentication from "./hooks/use-initial-authentication";
import useRecoilStateObject from "./hooks/use-recoil-state-object";

export interface IControlPanelProps
{
    /** Control panel extensions array. */
    extensions: IControlPanelExtension<unknown, unknown>[];

    /** Authentication extension. */
    authenticator: IControlPanelAuthenticator;

    /** Control panel base location (for a router). */
    location: string;

    /** Control panel localization objects. */
    locale: {
        /** Common popup state text localization. */
        popup: ControlPanelLocale.ICommonPopupStatesLocale,

        /** Authentication locale. */
        authenticator: ControlPanelLocale.IAuthenticatorLocale
    };

    /** Control panel screen extensions array. */
    screenExtensions?: IControlPanelScreenExtension[];

    /** Define recaptcha public key to execute all dangerous
     * tasks with recaptcha protection. */
    recaptchaPublicKey?: string;
}

/**
 * Global control panel properties storage.
 */
interface IControlPanelRootContext
{
    /** Array of provided extensions. */
    extensions: { [key: string]: IControlPanelExtension<unknown, unknown> };

    /** Array of provided screen extensions. */
    screenExtensions: { [key: string]: IControlPanelScreenExtension };

    /** Authentication extension. */
    authenticator: IControlPanelAuthenticator;

    /** Define recaptcha public key to execute all dangerous
     * tasks with recaptcha protection. */
    recaptchaPublicKey: string;

    /** Control panel localization objects. */
    locale: IControlPanelProps["locale"];
}

/**
 * Global control panel properties storage.
 */
export const ControlPanelRootContext = createContext<Partial<IControlPanelRootContext>>({});

/**
 * Control panel internal component.
 * @internal
 */
const ControlPanelRoot = memo((props: IControlPanelProps & { rootRef: React.LegacyRef<HTMLDivElement> }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { setState: setLoading } = useRecoilStateObject(loaderComponentState);
    const { setState: setPopupData } = useRecoilStateObject(popupComponentState);

    const authenticationResult = useRef<boolean | null>(null);

    const { authenticator, recaptchaPublicKey, locale } = props;

    const screenExtensions = props.screenExtensions ? useExtensionsObject(props.screenExtensions) : {};
    const extensions = useExtensionsObject(props.extensions);

    useLayoutEffect(() => {
        setLoading(true);

        useInitialAuthentication(props.authenticator, recaptchaPublicKey).then(response => {
            const startTime = Date.now();
            const lastPathnamePart = location.pathname.split("/").slice(-1)[0];

            if (!response && lastPathnamePart != "auth")
                navigate("/auth");

            else if (response && lastPathnamePart == "auth")
                navigate("/");

            authenticationResult.current = response;

            const timeoutLeft = limitNumber(400 - (Date.now() - startTime), { bottom: 0 });
            setTimeout(() => setLoading(false), timeoutLeft);
        }).catch(error => setPopupData(PopupOptions.moduleCriticalFailure(
            error.message || String(error),
            locale.popup.ModuleCriticalFailure
        )));
    }, [ location.pathname ]);

    const cplRootClassName = classNames("cpl-root");
    return <main className={ cplRootClassName } ref={ props.rootRef }>
        <LoaderComponent />
        <PopupComponent />

        <ControlPanelRootContext.Provider value={ {
            extensions, screenExtensions, authenticator, recaptchaPublicKey, locale
        } }>
            <ErrorBoundary FallbackComponent={ FallbackComponent }>
                <Routes>
                    <Route path="/auth" element={ <AuthenticationComponent /> } />
                    <Route path="*" element={ <span>CPL Form handler</span> } />
                </Routes>
            </ErrorBoundary>
        </ControlPanelRootContext.Provider>
    </main>;
});

/**
 * ### Custom website control panel managed by user-created add-ons.
 *
 * _Supports full interface localization using `locale` property._
 *
 * _Common extensions supplies together with a module._
 */
export default memo(forwardRef((props: IControlPanelProps, ref: ForwardedRef<HTMLDivElement>) => {
    // Provide recoil root, router and toast component context
    return <RecoilRoot>
        <Router basename={ props.location }>
            <ToastComponent children={ <ControlPanelRoot { ...props } rootRef={ ref } /> } />
        </Router>
    </RecoilRoot>;
}));
