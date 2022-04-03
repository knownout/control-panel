/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { FingerPrintIcon } from "@heroicons/react/outline";
import { IdentificationIcon, KeyIcon } from "@heroicons/react/solid";

import { Button, Input } from "@knownout/interface";
import { classNames } from "@knownout/lib";

import sha256 from "crypto-js/sha256";

import React, { memo, useCallback, useContext, useRef, useState } from "react";

import { ControlPanelRootContext } from "../../ControlPanel";

import { TAccountData } from "../../global/AuthenticationTypes";
import PopupOptions from "../../global/state/PopupOptions";
import useLoadingState from "../../hooks/use-loading-state";
import useMinLoadingTime from "../../hooks/use-min-loading-time";
import useRecoilStateObject from "../../hooks/use-recoil-state-object";
import { popupComponentState } from "../PopupComponent";

import "./AuthenticationComponent.scss";

/**
 * React component to create authentication form.
 * @internal
 */
export default memo((props: { updateAuthStatus (): void }) => {
    const { authenticator, recaptchaPublicKey, locale } = useContext(ControlPanelRootContext);

    const loginComponent = useRef<HTMLInputElement>(null),
        passwordComponent = useRef<HTMLInputElement>(null);

    // Disable form on loading to protect data from modifying.
    const [ formDisabled, setFormDisabled ] = useState(false);

    // These states used only for a button enable/disable (waste of resources).
    const [ login, setLogin ] = useState(false);
    const [ password, setPassword ] = useState(false);

    const { setState: setPopupState } = useRecoilStateObject(popupComponentState);
    const { startLoading, finishLoading } = useLoadingState();

    // Process only if authentication extension and localization provided.
    if (!authenticator) throw new Error("No authenticator extension provided");
    if (!locale) throw new Error("No locale provided");

    const onComponentLoginButtonClick = useCallback(async () => {
        // Check if input elements exist.
        if (!loginComponent.current || !passwordComponent.current) return;

        const accountData: TAccountData = {
            hash: sha256(passwordComponent.current.value).toString(),
            username: loginComponent.current.value
        };

        // Disable form and send authentication request.
        setFormDisabled(true);
        await authenticator.requireServerAuthentication(accountData, recaptchaPublicKey).then(response => {

            // Show popup if not authenticated.
            if (!response) return setPopupState(PopupOptions.authenticationFailure(() => {
                setPopupState({ open: false });

                if (passwordComponent.current) {
                    passwordComponent.current.value = "";
                    passwordComponent.current.dispatchEvent(new Event("input", { bubbles: true }));
                }
                if (loginComponent.current) loginComponent.current.focus();
            }, locale.popup.AuthenticationFailure));

            // Show loader and redirect to title page if authenticated.
            startLoading("auth-wait");
            setTimeout(() => useMinLoadingTime(() => authenticator.cacheAccountData(accountData))
                .then(() => {
                    props.updateAuthStatus();
                    finishLoading("auth-wait");
                }), 200);

        }).catch(error => setPopupState(PopupOptions.moduleCriticalFailure(
            error.message || String(error),
            locale.popup.ModuleCriticalFailure)
        ));

        // Leave the button in the loading state a little longer.
        await new Promise(r => setTimeout(r, 100));
        setFormDisabled(false);
    }, [ recaptchaPublicKey, authenticator, setPopupState, loginComponent.current, passwordComponent.current ]);

    if (authenticator.requireCachedAccountData()) return null;

    const authenticationFormClassName = classNames("authentication-form", { disabled: formDisabled });
    return <div className={ authenticationFormClassName }>
        <h1>{ locale.authenticator.title }</h1>
        <p>{ locale.authenticator.description }</p>

        <Input placeholder={ locale.authenticator.usernameInputPlaceholder } icon={ <IdentificationIcon /> }
               ref={ loginComponent } onInput={ value => setLogin(value.length > 3) } />

        <Input placeholder={ locale.authenticator.passwordInputPlaceholder } type="password" icon={ <KeyIcon /> }
               ref={ passwordComponent } onInput={ value => setPassword(value.length > 3) } />

        <div className="recaptcha-hint">
            <span>{ locale.authenticator.recaptchaDescription }</span>
            <div className="recaptcha-links">
                <a href="https://www.google.com/intl/ru/policies/terms/" className="ui clean link">
                    { locale.authenticator.recaptchaTermsLabel }
                </a>
                <a href="https://www.google.com/intl/ru/policies/privacy/" className="ui clean link">
                    { locale.authenticator.recaptchaPrivacyLabel }
                </a>
            </div>
        </div>

        <Button icon={ <FingerPrintIcon /> } onClick={ onComponentLoginButtonClick } disableOnLoading={ true }
                disabled={ !login || !password }>
            { locale.authenticator.loginButtonLabel }
        </Button>
    </div>;
});
