/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { classNames } from "@knownout/lib";

import React, { createContext, ForwardedRef, forwardRef, memo, useLayoutEffect, useState } from "react";
import { Route } from "react-router";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AuthenticationComponent from "./components/AuthenticationComponent";
import ControlPanelComponent from "./components/ControlPanelComponents/RootComponent";
import ErrorBoundary from "./components/ErrorBoundary";
import FallbackComponent from "./components/FallbackComponent";
import LoaderComponent from "./components/LoaderComponent";
import PopupComponent, { popupComponentState } from "./components/PopupComponent";
import ToastComponent from "./components/ToastComponent/ToastComponent";
import "./ControlPanel.scss";
import { IControlPanelAuthenticator } from "./global/AuthenticationTypes";
import {
    IControlPanelExtension,
    IControlPanelScreenExtension,
    TCommonObject,
    TControlPanelExtensionsObject
} from "./global/ExtensionTypes";
import ControlPanelLocale from "./global/LocaleTypes";
import PopupOptions from "./global/state/PopupOptions";
import useExtensionsObject from "./hooks/use-extensions-object";
import useInitialAuthentication from "./hooks/use-initial-authentication";
import useLoadingState from "./hooks/use-loading-state";
import useMinLoadingTime from "./hooks/use-min-loading-time";
import useRecoilStateObject from "./hooks/use-recoil-state-object";
import { bindContextToMethods } from "./global/ExtensionUtils";

export interface IControlPanelProps
{
    /** Control panel extensions array. */
    extensions: IControlPanelExtension<TCommonObject, TCommonObject>[];

    /** Authentication extension. */
    authenticator: IControlPanelAuthenticator;

    /** Control panel base location (for a router). */
    location: string;

    /** Control panel localization objects. */
    locale: {
        /** Common popup state text localization. */
        popup: ControlPanelLocale.ICommonPopupStatesLocale,

        /** Authentication locale. */
        authenticator: ControlPanelLocale.IAuthenticatorLocale,

        /** General locale options. */
        general: ControlPanelLocale.IGeneralLocale
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
    extensions: TControlPanelExtensionsObject<TCommonObject, TCommonObject>;

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
const ControlPanelRoot = memo((props: IControlPanelProps & { rootRef: React.LegacyRef<HTMLElement> }) => {
    const { startLoading, finishLoading } = useLoadingState();
    const { setState: setPopupData } = useRecoilStateObject(popupComponentState);

    const [ authentication, setAuthentication ] = useState(false);

    const { authenticator, recaptchaPublicKey, locale } = props;

    const screenExtensions = props.screenExtensions ? useExtensionsObject(props.screenExtensions) : {};
    const extensions = useExtensionsObject(props.extensions);

    useLayoutEffect(() => {
        startLoading("auth-verify");

        useInitialAuthentication(props.authenticator, recaptchaPublicKey).then(response =>
            useMinLoadingTime(() => setAuthentication(response)).then(() => finishLoading("auth-verify"))
        ).catch(error => setPopupData(PopupOptions.moduleCriticalFailure(
            error.message || String(error),
            locale.popup.ModuleCriticalFailure
        )));
    }, [ authentication ]);

    const cplRootClassName = classNames("cpl-root");
    return <main className={ cplRootClassName } ref={ props.rootRef }>
        <LoaderComponent />
        <PopupComponent />

        <ControlPanelRootContext.Provider value={ {
            extensions, screenExtensions, authenticator, recaptchaPublicKey, locale
        } }>
            <ErrorBoundary FallbackComponent={ FallbackComponent }>
                { authentication ? <ControlPanelComponent />
                    : <AuthenticationComponent updateAuthStatus={ () => setAuthentication(true) } />
                }
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
export default memo(forwardRef((props: IControlPanelProps, ref: ForwardedRef<HTMLElement>) => {
    const { extensions, ...resetProps } = props;
    extensions.forEach(extension => bindContextToMethods(extension));

    // Provide recoil root, router and toast component context
    return <RecoilRoot>
        <Router basename={ props.location }>
            <ToastComponent children={ (() => {
                const Component = <ControlPanelRoot { ...resetProps } rootRef={ ref } extensions={ extensions } />;
                return <Routes>
                    <Route path="/:objectsType/" element={ Component } />
                    <Route path="/:objectsType/:objectID/*" element={ Component } />
                    <Route path="*" element={ Component } />
                </Routes>;
            })() } />
        </Router>
    </RecoilRoot>;
}));
