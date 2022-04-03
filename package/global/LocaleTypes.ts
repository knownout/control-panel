/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

/**
 * Localization types namespace.
 */
namespace ControlPanelLocale
{
    /**
     * Authentication form localization.
     */
    export interface IAuthenticatorLocale
    {
        /** Authentication from title. */
        title: string;

        /** Authentication from top description. */
        description: string;

        /** Username input placeholder text. */
        usernameInputPlaceholder: string;

        /** Password input placeholder text. */
        passwordInputPlaceholder: string;

        /** Recaptcha description text. */
        recaptchaDescription: string;

        recaptchaTermsLabel: string;

        recaptchaPrivacyLabel: string;

        loginButtonLabel: string;
    }

    /**
     * General popup state locale.
     */
    export interface IPopupStateLocale
    {
        /** Popup title (h1) text. */
        title: string;

        /** Popup text content. */
        textContent: string[];

        /** Popup button text. */
        buttonLabel: string;
    }

    /**
     * Common popup state locales list
     */
    export interface ICommonPopupStatesLocale
    {
        AuthenticationFailure: ControlPanelLocale.IPopupStateLocale;

        ModuleCriticalFailure: ControlPanelLocale.IPopupStateLocale;

        WelcomeMessage: {
            title: string;

            versionLabel: string;

            moduleDescription: string;

            aboutModuleButton: string;

            faqButton: string;

            extensionsButton: string;

            developersButton: string;

            appearHint: string;

            closeButton: string;

            closeAndNotShowButton: string;
        };
    }

    /**
     * General locale options.
     */
    export interface IGeneralLocale
    {
        previewSearch: string;
    }
}

export default ControlPanelLocale;
